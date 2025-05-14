// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CharityDonation
 * @dev Smart contract for transparent charity donations using USDC or native ETH
 */
contract CharityDonation {
    // USDC token contract
    IERC20 public usdcToken;
    
    // Contract owner address
    address public owner;
    
    // Modifier to restrict functions to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized: caller is not the owner");
        _;
    }

    // Charity structure
    struct Charity {
        string name;
        string description;
        address walletAddress;
        bool isVerified;
        uint256 totalUsdcDonations;
        uint256 totalEthDonations;
    }

    // Donation structure with token type flag
    struct Donation {
        address donor;
        uint256 charityId;
        uint256 amount;
        uint256 timestamp;
        bool isEth; // true if ETH donation, false if USDC donation
    }

    // Mapping from charity ID to Charity
    mapping(uint256 => Charity) public charities;

    // Array of all donations
    Donation[] public donations;

    // Charity counter
    uint256 public charityCount;

    // Events
    event CharityAdded(uint256 indexed charityId, string name, address walletAddress);
    event CharityVerified(uint256 indexed charityId);
    event DonationMade(uint256 indexed donationId, address indexed donor, uint256 indexed charityId, uint256 amount, bool isEth);
    event UsdcWithdrawn(uint256 indexed charityId, address indexed wallet, uint256 amount);
    event EthWithdrawn(uint256 indexed charityId, address indexed wallet, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Constructor sets the USDC token address and owner
     * @param _usdcToken Address of the USDC token contract
     * @param _initialOwner Address of the initial owner (can be different from deployer)
     */
    constructor(address _usdcToken, address _initialOwner) {
        usdcToken = IERC20(_usdcToken);
        owner = _initialOwner;
        
        emit OwnershipTransferred(address(0), _initialOwner);
    }
    
    /**
     * @dev Transfer ownership to a new address
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        
        address oldOwner = owner;
        owner = _newOwner;
        
        emit OwnershipTransferred(oldOwner, _newOwner);
    }

    /**
     * @dev Add a new charity (owner only)
     * @param _name Name of the charity
     * @param _description Description of the charity
     * @param _walletAddress Wallet address of the charity
     * @return charityId ID of the newly added charity
     */
    function addCharity(string memory _name, string memory _description, address _walletAddress)
        external
        onlyOwner
        returns (uint256 charityId)
    {
        charityId = charityCount++;

        charities[charityId] = Charity({
            name: _name,
            description: _description,
            walletAddress: _walletAddress,
            isVerified: false,
            totalUsdcDonations: 0,
            totalEthDonations: 0
        });

        emit CharityAdded(charityId, _name, _walletAddress);
    }

    /**
     * @dev Verify a charity (owner only)
     * @param _charityId ID of the charity to verify
     */
    function verifyCharity(uint256 _charityId) external onlyOwner {
        require(_charityId < charityCount, "Charity does not exist");
        require(!charities[_charityId].isVerified, "Charity already verified");

        charities[_charityId].isVerified = true;

        emit CharityVerified(_charityId);
    }

    /**
     * @dev Make a USDC donation to a charity
     * @param _charityId ID of the charity to donate to
     * @param _amount Amount of USDC to donate
     * @return donationId ID of the donation
     */
    function donateUsdc(uint256 _charityId, uint256 _amount) external returns (uint256 donationId) {
        require(_charityId < charityCount, "Charity does not exist");
        require(charities[_charityId].isVerified, "Charity not verified");
        require(_amount > 0, "Donation amount must be greater than 0");

        // Transfer USDC from donor to contract
        bool success = usdcToken.transferFrom(msg.sender, address(this), _amount);
        require(success, "USDC transfer failed");

        // Create donation record
        donationId = donations.length;
        donations.push(Donation({
            donor: msg.sender,
            charityId: _charityId,
            amount: _amount,
            timestamp: block.timestamp,
            isEth: false
        }));

        // Update charity total donations
        charities[_charityId].totalUsdcDonations += _amount;

        emit DonationMade(donationId, msg.sender, _charityId, _amount, false);
    }
    
    /**
     * @dev Make an ETH donation to a charity
     * @param _charityId ID of the charity to donate to
     * @return donationId ID of the donation
     */
    function donateEth(uint256 _charityId) external payable returns (uint256 donationId) {
        require(_charityId < charityCount, "Charity does not exist");
        require(charities[_charityId].isVerified, "Charity not verified");
        require(msg.value > 0, "Donation amount must be greater than 0");

        // Create donation record
        donationId = donations.length;
        donations.push(Donation({
            donor: msg.sender,
            charityId: _charityId,
            amount: msg.value,
            timestamp: block.timestamp,
            isEth: true
        }));

        // Update charity total donations
        charities[_charityId].totalEthDonations += msg.value;

        emit DonationMade(donationId, msg.sender, _charityId, msg.value, true);
    }

    /**
     * @dev Withdraw USDC funds to charity wallet
     * @param _charityId ID of the charity
     * @param _amount Amount of USDC to withdraw
     */
    function withdrawUsdc(uint256 _charityId, uint256 _amount) external {
        require(_charityId < charityCount, "Charity does not exist");
        require(charities[_charityId].isVerified, "Charity not verified");
        require(msg.sender == charities[_charityId].walletAddress, "Only charity wallet can withdraw");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= charities[_charityId].totalUsdcDonations, "Insufficient USDC funds");

        // Transfer USDC from contract to charity wallet
        bool success = usdcToken.transfer(msg.sender, _amount);
        require(success, "USDC transfer failed");

        // Update charity total donations
        charities[_charityId].totalUsdcDonations -= _amount;

        emit UsdcWithdrawn(_charityId, msg.sender, _amount);
    }
    
    /**
     * @dev Withdraw ETH funds to charity wallet
     * @param _charityId ID of the charity
     * @param _amount Amount of ETH to withdraw
     */
    function withdrawEth(uint256 _charityId, uint256 _amount) external {
        require(_charityId < charityCount, "Charity does not exist");
        require(charities[_charityId].isVerified, "Charity not verified");
        require(msg.sender == charities[_charityId].walletAddress, "Only charity wallet can withdraw");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= charities[_charityId].totalEthDonations, "Insufficient ETH funds");

        // Update charity total donations before transfer to prevent reentrancy
        charities[_charityId].totalEthDonations -= _amount;
        
        // Transfer ETH from contract to charity wallet
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "ETH transfer failed");

        emit EthWithdrawn(_charityId, msg.sender, _amount);
    }

    /**
     * @dev Get charity details
     * @param _charityId ID of the charity
     * @return name Name of the charity
     * @return description Description of the charity
     * @return walletAddress Wallet address of the charity
     * @return isVerified Whether the charity is verified
     * @return totalUsdcDonations Total USDC donations received by the charity
     * @return totalEthDonations Total ETH donations received by the charity
     */
    function getCharity(uint256 _charityId) external view returns (
        string memory name,
        string memory description,
        address walletAddress,
        bool isVerified,
        uint256 totalUsdcDonations,
        uint256 totalEthDonations
    ) {
        require(_charityId < charityCount, "Charity does not exist");

        Charity storage charity = charities[_charityId];
        return (
            charity.name,
            charity.description,
            charity.walletAddress,
            charity.isVerified,
            charity.totalUsdcDonations,
            charity.totalEthDonations
        );
    }

    /**
     * @dev Get donation details
     * @param _donationId ID of the donation
     * @return donor Address of the donor
     * @return charityId ID of the charity
     * @return amount Amount donated
     * @return timestamp Timestamp of the donation
     * @return isEth Whether the donation was in ETH (true) or USDC (false)
     */
    function getDonation(uint256 _donationId) external view returns (
        address donor,
        uint256 charityId,
        uint256 amount,
        uint256 timestamp,
        bool isEth
    ) {
        require(_donationId < donations.length, "Donation does not exist");

        Donation storage donation = donations[_donationId];
        return (
            donation.donor,
            donation.charityId,
            donation.amount,
            donation.timestamp,
            donation.isEth
        );
    }

    /**
     * @dev Get total number of donations
     * @return Total number of donations
     */
    function getDonationCount() external view returns (uint256) {
        return donations.length;
    }
    
    /**
     * @dev Fallback function to accept ETH
     */
    receive() external payable {
        // ETH received without data will be considered a donation to charity ID 0 if it exists
        if (charityCount > 0 && charities[0].isVerified) {
            charities[0].totalEthDonations += msg.value;
            
            uint256 donationId = donations.length;
            donations.push(Donation({
                donor: msg.sender,
                charityId: 0,
                amount: msg.value,
                timestamp: block.timestamp,
                isEth: true
            }));
            
            emit DonationMade(donationId, msg.sender, 0, msg.value, true);
        }
    }
}