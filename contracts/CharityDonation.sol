// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CharityDonation
 * @dev Smart contract for transparent charity donations using USDC
 */
contract CharityDonation is Ownable {
    // USDC token contract
    IERC20 public usdcToken;

    // Charity structure
    struct Charity {
        string name;
        string description;
        address walletAddress;
        bool isVerified;
        uint256 totalDonations;
    }

    // Donation structure
    struct Donation {
        address donor;
        uint256 charityId;
        uint256 amount;
        uint256 timestamp;
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
    event DonationMade(uint256 indexed donationId, address indexed donor, uint256 indexed charityId, uint256 amount);
    event FundsWithdrawn(uint256 indexed charityId, address indexed wallet, uint256 amount);

    /**
     * @dev Constructor sets the USDC token address and initializes Ownable
     * @param _usdcToken Address of the USDC token contract
     */
    constructor(address _usdcToken) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @dev Add a new charity (admin only)
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
            totalDonations: 0
        });

        emit CharityAdded(charityId, _name, _walletAddress);
    }

    /**
     * @dev Verify a charity (admin only)
     * @param _charityId ID of the charity to verify
     */
    function verifyCharity(uint256 _charityId) external onlyOwner {
        require(_charityId < charityCount, "Charity does not exist");
        require(!charities[_charityId].isVerified, "Charity already verified");

        charities[_charityId].isVerified = true;

        emit CharityVerified(_charityId);
    }

    /**
     * @dev Make a donation to a charity
     * @param _charityId ID of the charity to donate to
     * @param _amount Amount of USDC to donate
     * @return donationId ID of the donation
     */
    function donate(uint256 _charityId, uint256 _amount) external returns (uint256 donationId) {
        require(_charityId < charityCount, "Charity does not exist");
        require(charities[_charityId].isVerified, "Charity not verified");
        require(_amount > 0, "Donation amount must be greater than 0");

        // Transfer USDC from donor to contract
        require(usdcToken.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");

        // Create donation record
        donationId = donations.length;
        donations.push(Donation({
            donor: msg.sender,
            charityId: _charityId,
            amount: _amount,
            timestamp: block.timestamp
        }));

        // Update charity total donations
        charities[_charityId].totalDonations += _amount;

        emit DonationMade(donationId, msg.sender, _charityId, _amount);
    }

    /**
     * @dev Withdraw funds to charity wallet
     * @param _charityId ID of the charity
     * @param _amount Amount of USDC to withdraw
     */
    function withdrawFunds(uint256 _charityId, uint256 _amount) external {
        require(_charityId < charityCount, "Charity does not exist");
        require(charities[_charityId].isVerified, "Charity not verified");
        require(msg.sender == charities[_charityId].walletAddress, "Only charity wallet can withdraw");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= charities[_charityId].totalDonations, "Insufficient funds");

        // Transfer USDC from contract to charity wallet
        require(usdcToken.transfer(msg.sender, _amount), "USDC transfer failed");

        // Update charity total donations
        charities[_charityId].totalDonations -= _amount;

        emit FundsWithdrawn(_charityId, msg.sender, _amount);
    }

    /**
     * @dev Get charity details
     * @param _charityId ID of the charity
     * @return name Name of the charity
     * @return description Description of the charity
     * @return walletAddress Wallet address of the charity
     * @return isVerified Whether the charity is verified
     * @return totalDonations Total donations received by the charity
     */
    function getCharity(uint256 _charityId) external view returns (
        string memory name,
        string memory description,
        address walletAddress,
        bool isVerified,
        uint256 totalDonations
    ) {
        require(_charityId < charityCount, "Charity does not exist");

        Charity storage charity = charities[_charityId];
        return (
            charity.name,
            charity.description,
            charity.walletAddress,
            charity.isVerified,
            charity.totalDonations
        );
    }

    /**
     * @dev Get donation details
     * @param _donationId ID of the donation
     * @return donor Address of the donor
     * @return charityId ID of the charity
     * @return amount Amount of USDC donated
     * @return timestamp Timestamp of the donation
     */
    function getDonation(uint256 _donationId) external view returns (
        address donor,
        uint256 charityId,
        uint256 amount,
        uint256 timestamp
    ) {
        require(_donationId < donations.length, "Donation does not exist");

        Donation storage donation = donations[_donationId];
        return (
            donation.donor,
            donation.charityId,
            donation.amount,
            donation.timestamp
        );
    }

    /**
     * @dev Get total number of donations
     * @return Total number of donations
     */
    function getDonationCount() external view returns (uint256) {
        return donations.length;
    }
}
