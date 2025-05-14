import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { causesApi, categoriesApi, auth } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Category, 
  Cause, 
  CreateCauseRequest, 
  CreateCategoryRequest 
} from "@/types";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  
  // Check if the user is an admin when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const user = auth.getUser();
      setIsAdmin(user?.role === 'admin');
    }
  }, [isAuthenticated]);
  
  // Add state for new cause and category
  const [newCause, setNewCause] = useState<CreateCauseRequest>({
    title: "",
    organization: "",
    description: "",
    image_url: "",
    goal_amount: 0,
    category_id: 0,
    featured: false
  });
  
  const [newCategory, setNewCategory] = useState<CreateCategoryRequest>({
    name: "",
    description: ""
  });

  // Define all mutations at the top level
  const createCauseMutation = useMutation({
    mutationFn: (causeData: CreateCauseRequest) => causesApi.create(causeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
      toast.success("Cause created successfully!");
      setNewCause({
        title: "",
        organization: "",
        description: "",
        image_url: "",
        goal_amount: 0,
        category_id: 0,
        featured: false
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create cause: ${error.message}`);
    }
  });

  // Delete cause mutation
  const deleteCauseMutation = useMutation({
    mutationFn: (id: number) => causesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["causes"] });
      toast.success("Cause deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete cause: ${error.message}`);
    }
  });

  // Add mutation for creating categories
  const createCategoryMutation = useMutation({
    mutationFn: (categoryData: CreateCategoryRequest) => categoriesApi.create(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
      setNewCategory({
        name: "",
        description: ""
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create category: ${error.message}`);
    }
  });

  // Fetch categories - conditionally enabled based on authentication
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await categoriesApi.getAll();
        console.log("Categories API response:", response);
        
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        console.warn("Invalid categories API response, returning empty array");
        return [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
    enabled: isAuthenticated // Only run this query if authenticated
  });

  // Fetch all causes - conditionally enabled based on authentication
  const { data: causes = [] } = useQuery<Cause[]>({
    queryKey: ["causes"],
    queryFn: async () => {
      try {
        const response = await causesApi.getAll();
        console.log("Causes API response:", response);
        
        if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        console.warn("Invalid causes API response, returning empty array");
        return [];
      } catch (error) {
        console.error("Error fetching causes:", error);
        return [];
      }
    },
    enabled: isAuthenticated // Only run this query if authenticated
  });

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Login attempt with:", loginData.email);
      const response = await auth.login(loginData.email, loginData.password);
      setIsAuthenticated(true);
      
      // Check if the user is an admin
      if (response.user.role !== 'admin') {
        toast.error("You don't have admin privileges");
        auth.logout();
        setIsAuthenticated(false);
        return;
      }
      
      setIsAdmin(true);
      toast.success("Logged in successfully as admin!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
  };

  // Handle login input change
  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCause({
      ...newCause,
      [name]: name === "goal_amount" ? parseFloat(value) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewCause({
      ...newCause,
      [name]: name === "category_id" ? parseInt(value) : value === "true"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCauseMutation.mutate(newCause);
  };

  // Handle category input change
  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  // Handle category form submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCategoryMutation.mutate(newCategory);
  };

  // Render login form if not authenticated
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input 
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    required
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <Input 
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    required
                    placeholder="password123"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-teal-500 hover:bg-teal-600"
                >
                  Login
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Only administrators can access this dashboard
              </p>
            </CardContent>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <section className="bg-white border-b py-8">
          <div className="container">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage causes and donations
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="add-cause" className="mb-8">
              <TabsList className="mb-6">
                <TabsTrigger value="add-cause">Add New Cause</TabsTrigger>
                <TabsTrigger value="manage-causes">Manage Causes</TabsTrigger>
                <TabsTrigger value="manage-categories">Manage Categories</TabsTrigger>
              </TabsList>
              
              <TabsContent value="add-cause">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Cause</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input 
                          name="title"
                          value={newCause.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Organization</label>
                        <Input 
                          name="organization"
                          value={newCause.organization}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea 
                          name="description"
                          value={newCause.description}
                          onChange={handleInputChange}
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <Input 
                          name="image_url"
                          value={newCause.image_url}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Goal Amount</label>
                        <Input 
                          name="goal_amount"
                          type="number"
                          value={newCause.goal_amount.toString()}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <Select 
                          name="category_id" 
                          value={newCause.category_id.toString()} 
                          onValueChange={(value) => handleSelectChange("category_id", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Featured</label>
                        <Select 
                          name="featured" 
                          value={newCause.featured.toString()} 
                          onValueChange={(value) => handleSelectChange("featured", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Is this a featured cause?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-teal-500 hover:bg-teal-600"
                        disabled={createCauseMutation.isPending}
                      >
                        {createCauseMutation.isPending ? "Creating..." : "Create Cause"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="manage-causes">
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Causes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {Array.isArray(causes) && causes.length > 0 ? (
                        causes.map((cause) => (
                          <div key={cause.id} className="py-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{cause.title}</div>
                              <div className="text-sm text-gray-500">{cause.organization}</div>
                              <div className="text-sm text-gray-500">Goal: ${cause.goal_amount}</div>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteCauseMutation.mutate(cause.id)}
                              disabled={deleteCauseMutation.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-500">No causes found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manage-categories">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input 
                          name="name"
                          value={newCategory.name}
                          onChange={handleCategoryInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea 
                          name="description"
                          value={newCategory.description}
                          onChange={handleCategoryInputChange}
                          rows={4}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="bg-teal-500 hover:bg-teal-600"
                        disabled={createCategoryMutation.isPending}
                      >
                        {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Existing Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      {Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((category) => (
                          <div key={category.id} className="py-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-gray-500">{category.description}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-500">No categories found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
