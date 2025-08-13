// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title IERC20
 * @dev Interface for the ERC20 token standard.
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @title DashboardToolsContract
 * @dev Manages tool usage payments and event logging for wowseoweb3 dashboard tools.
 * This contract supports dynamic tool registration and currently handles 11 tools for the main dashboard.
 */
contract DashboardToolsContract is Initializable, AccessControlEnumerableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    bytes32 public constant EMITTER_ROLE = keccak256("EMITTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant URI_WHITELIST_ADMIN_ROLE = keccak256("URI_WHITELIST_ADMIN_ROLE");
    bytes32 public constant PRICE_ADMIN_ROLE = keccak256("PRICE_ADMIN_ROLE");
    bytes32 public constant TOKEN_ADMIN_ROLE = keccak256("TOKEN_ADMIN_ROLE");

    // --- Storage for original functionality ---
    mapping(string => bool) public allowedURIPrefixes;
    mapping(bytes32 => bytes32) public contentHashes; // contentId => hash

    // --- Storage for Payment Logic ---
    address public treasuryAddress;
    mapping(address => bool) public acceptedTokens; // tokenAddress => isAccepted
    mapping(bytes32 => uint256) public toolPrices; // toolId => price (in token's smallest unit)
    bytes32[] public registeredToolIds; // Array of toolIds that have a price set
    mapping(bytes32 => bool) public isToolRegistered; // toolId => isRegistered (and has a price)
    uint256 public completeAuditDiscountPercentage; // e.g., 10 for 10%

    // --- Events for original functionality ---
    event ToolAction(
        bytes32 indexed toolId,
        bytes32 indexed actionType,
        address indexed eventUser,
        string resourceId,
        string metadataURI,
        uint256 timestamp
    );
    event ContentHashStored(
        bytes32 indexed contentId,
        bytes32 contentHash,
        string metadataURI,
        uint256 timestamp
    );
    event AllowedURIPrefixSet(string prefix, bool allowed);

    // --- Events for Payment Logic ---
    event PaymentMade(
        address indexed user,
        address indexed tokenPaid,
        uint256 totalAmountPaid, // Amount after discount
        bytes32[] toolIdsPurchased,
        bool discountedForCompleteAudit,
        uint256 timestamp
    );
    event PriceUpdated(bytes32 indexed toolId, uint256 newPrice, uint256 timestamp);
    event AcceptedTokenStatusChanged(address indexed tokenAddress, bool isAccepted, uint256 timestamp);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury, uint256 timestamp);
    event DiscountPercentageUpdated(uint256 newPercentage, uint256 timestamp);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialAdmin,
        address initialEmitter,
        address initialPauser,
        address initialUpgrader,
        address initialUriWhitelistAdmin,
        address initialPriceAdmin,
        address initialTokenAdmin,
        address _treasuryAddress,
        uint256 _initialDiscountPercentage
    ) public initializer {
        __AccessControlEnumerable_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        require(initialAdmin != address(0), "Initial admin cannot be zero");
        require(_treasuryAddress != address(0), "Treasury cannot be zero");

        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(EMITTER_ROLE, initialEmitter);
        _grantRole(PAUSER_ROLE, initialPauser);
        _grantRole(UPGRADER_ROLE, initialUpgrader);
        _grantRole(URI_WHITELIST_ADMIN_ROLE, initialUriWhitelistAdmin);
        _grantRole(PRICE_ADMIN_ROLE, initialPriceAdmin);
        _grantRole(TOKEN_ADMIN_ROLE, initialTokenAdmin);

        treasuryAddress = _treasuryAddress;
        _setCompleteAuditDiscountPercentage(_initialDiscountPercentage);
    }

    function _getURIPrefix(string memory uri) internal pure returns (string memory) {
        uint256 firstColon = 0;
        bytes memory uriBytes = bytes(uri);
        for (uint256 i = 0; i < uriBytes.length; i++) {
            if (uriBytes[i] == ":") {
                firstColon = i;
                break;
            }
        }
        require(firstColon > 0 && firstColon + 2 < uriBytes.length, "Invalid URI format for prefix");
        bytes memory prefixBytes = new bytes(firstColon + 3);
        for (uint256 i = 0; i <= firstColon + 2; i++) {
            prefixBytes[i] = uriBytes[i];
        }
        return string(prefixBytes);
    }

    function _validateMetadataURI(string memory uri) internal view {
        require(bytes(uri).length > 0, "Metadata URI cannot be empty if provided");
        require(allowedURIPrefixes[_getURIPrefix(uri)], "Metadata URI prefix not allowed");
    }

    function setAllowedURIPrefix(string calldata prefix, bool allowed) external onlyRole(URI_WHITELIST_ADMIN_ROLE) {
        allowedURIPrefixes[prefix] = allowed;
        emit AllowedURIPrefixSet(prefix, allowed);
    }

    function emitToolAction(
        bytes32 _toolId,
        bytes32 _actionType,
        address _eventUser,
        string calldata _resourceId,
        string calldata _metadataURI
    ) external whenNotPaused onlyRole(EMITTER_ROLE) {
        require(_toolId != bytes32(0), "Tool ID cannot be zero");
        require(_actionType != bytes32(0), "Action Type cannot be zero");
        require(_eventUser != address(0), "Event user cannot be zero address");
        if (bytes(_metadataURI).length > 0) {
            _validateMetadataURI(_metadataURI);
        }
        emit ToolAction(_toolId, _actionType, _eventUser, _resourceId, _metadataURI, block.timestamp);
    }

    function registerUserInteraction(
        bytes32 _toolId,
        bytes32 _interactionType,
        address _eventUser,
        string calldata _resourceId,
        string calldata _metadataURI
    ) external whenNotPaused onlyRole(EMITTER_ROLE) {
        this.emitToolAction(_toolId, _interactionType, _eventUser, _resourceId, _metadataURI);
    }

    function storeHashForVerification(
        bytes32 _contentId,
        bytes32 _contentHash,
        string calldata _metadataURI
    ) external whenNotPaused onlyRole(EMITTER_ROLE) {
        require(_contentId != bytes32(0), "Content ID cannot be zero");
        require(_contentHash != bytes32(0), "Content hash cannot be zero");
        if (bytes(_metadataURI).length > 0) {
            _validateMetadataURI(_metadataURI);
        }
        contentHashes[_contentId] = _contentHash;
        emit ContentHashStored(_contentId, _contentHash, _metadataURI, block.timestamp);
    }

    function getHash(bytes32 _contentId) external view returns (bytes32) {
        return contentHashes[_contentId];
    }

    function setTreasuryAddress(address _newTreasuryAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newTreasuryAddress != address(0), "New treasury cannot be zero");
        address oldTreasury = treasuryAddress;
        treasuryAddress = _newTreasuryAddress;
        emit TreasuryUpdated(oldTreasury, _newTreasuryAddress, block.timestamp);
    }

    function addAcceptedToken(address _tokenAddress) external onlyRole(TOKEN_ADMIN_ROLE) {
        require(_tokenAddress != address(0), "Token address cannot be zero");
        acceptedTokens[_tokenAddress] = true;
        emit AcceptedTokenStatusChanged(_tokenAddress, true, block.timestamp);
    }

    function removeAcceptedToken(address _tokenAddress) external onlyRole(TOKEN_ADMIN_ROLE) {
        require(_tokenAddress != address(0), "Token address cannot be zero");
        acceptedTokens[_tokenAddress] = false;
        emit AcceptedTokenStatusChanged(_tokenAddress, false, block.timestamp);
    }

    function setToolPrice(bytes32 _toolId, uint256 _price) external onlyRole(PRICE_ADMIN_ROLE) {
        require(_toolId != bytes32(0), "Tool ID cannot be zero");
        uint256 oldPrice = toolPrices[_toolId];
        toolPrices[_toolId] = _price;

        if (_price > 0 && !isToolRegistered[_toolId]) {
            registeredToolIds.push(_toolId);
            isToolRegistered[_toolId] = true;
        } else if (_price == 0 && isToolRegistered[_toolId]) {
            isToolRegistered[_toolId] = false;
            for (uint256 i = 0; i < registeredToolIds.length; i++) {
                if (registeredToolIds[i] == _toolId) {
                    registeredToolIds[i] = registeredToolIds[registeredToolIds.length - 1];
                    registeredToolIds.pop();
                    break;
                }
            }
        }
        if (oldPrice != _price) {
            emit PriceUpdated(_toolId, _price, block.timestamp);
        }
    }

    function _setCompleteAuditDiscountPercentage(uint256 _percentage) internal {
        require(_percentage <= 100, "Discount cannot exceed 100%");
        uint256 oldPercentage = completeAuditDiscountPercentage;
        completeAuditDiscountPercentage = _percentage;
        if (oldPercentage != _percentage) {
            emit DiscountPercentageUpdated(_percentage, block.timestamp);
        }
    }

    function setCompleteAuditDiscountPercentage(uint256 _percentage) external onlyRole(PRICE_ADMIN_ROLE) {
        _setCompleteAuditDiscountPercentage(_percentage);
    }

    function _isToolIdInArray(bytes32 _toolId, bytes32[] memory _array, uint256 _count) internal pure returns (bool) {
        for (uint256 j = 0; j < _count; j++) {
            if (_array[j] == _toolId) {
                return true;
            }
        }
        return false;
    }

    function getToolsPrice(
        address _tokenAddress,
        bytes32[] calldata _toolIdsToPurchase
    ) public view returns (uint256 totalPriceBeforeDiscount, uint256 finalPrice, bool isCompleteAuditOffer) {
        require(acceptedTokens[_tokenAddress], "Token not accepted");
        require(_toolIdsToPurchase.length > 0, "No tools selected");

        uint256 calculatedTotalPrice = 0;
        bytes32[] memory uniqueToolIdsPurchasedAccumulator = new bytes32[](_toolIdsToPurchase.length);
        uint256 uniqueToolsInPurchaseCount = 0;

        for (uint256 i = 0; i < _toolIdsToPurchase.length; i++) {
            bytes32 toolId = _toolIdsToPurchase[i];
            require(toolPrices[toolId] > 0, "Invalid or unpriced tool selected");
            calculatedTotalPrice += toolPrices[toolId];
            if (!_isToolIdInArray(toolId, uniqueToolIdsPurchasedAccumulator, uniqueToolsInPurchaseCount)) {
                uniqueToolIdsPurchasedAccumulator[uniqueToolsInPurchaseCount] = toolId;
                uniqueToolsInPurchaseCount++;
            }
        }
        
        bytes32[] memory finalUniqueToolIdsPurchased = new bytes32[](uniqueToolsInPurchaseCount);
        for(uint256 i = 0; i < uniqueToolsInPurchaseCount; i++){
            finalUniqueToolIdsPurchased[i] = uniqueToolIdsPurchasedAccumulator[i];
        }

        totalPriceBeforeDiscount = calculatedTotalPrice;
        finalPrice = calculatedTotalPrice;
        uint256 activeRegisteredToolsCount = 0;
        for(uint256 i = 0; i < registeredToolIds.length; i++){
            if(isToolRegistered[registeredToolIds[i]]) { 
                activeRegisteredToolsCount++;
            }
        }
        
        if (activeRegisteredToolsCount > 0 && uniqueToolsInPurchaseCount == activeRegisteredToolsCount) {
            bool allActiveRegisteredToolsIncluded = true;
            for (uint256 i = 0; i < registeredToolIds.length; i++) {
                bytes32 registeredToolId = registeredToolIds[i];
                if (isToolRegistered[registeredToolId]) {
                     if (!_isToolIdInArray(registeredToolId, finalUniqueToolIdsPurchased, finalUniqueToolIdsPurchased.length)) {
                        allActiveRegisteredToolsIncluded = false;
                        break;
                    }
                }
            }
            if (allActiveRegisteredToolsIncluded) {
                isCompleteAuditOffer = true;
                if (completeAuditDiscountPercentage > 0 && completeAuditDiscountPercentage <= 100) {
                    uint256 discountAmount = (calculatedTotalPrice * completeAuditDiscountPercentage) / 100;
                    finalPrice = calculatedTotalPrice - discountAmount;
                }
            }
        }
    }

    function payForTools(
        address _tokenAddress,
        bytes32[] calldata _toolIdsToPurchase
    ) external whenNotPaused {
        (, uint256 priceToPay, bool isDiscounted) = getToolsPrice(_tokenAddress, _toolIdsToPurchase);
        
        require(priceToPay > 0, "Calculated price is zero");

        IERC20 token = IERC20(_tokenAddress);
        require(token.allowance(msg.sender, address(this)) >= priceToPay, "Token allowance too low");
        
        bool success = token.transferFrom(msg.sender, treasuryAddress, priceToPay);
        require(success, "Token transfer failed");

        emit PaymentMade(msg.sender, _tokenAddress, priceToPay, _toolIdsToPurchase, isDiscounted, block.timestamp);
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {
        // Custom upgrade authorization logic can be added here if needed.
    }
}