// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RealityCertificate
 * @notice Non-transferable ERC-721 NFT representing a Reality Certificate
 * @dev Stores content hash, timestamp, device ID, and owner address.
 *      Transfer is locked — certificates are soulbound to the creator.
 */
contract RealityCertificate is ERC721, Ownable {
    uint256 private _nextTokenId;

    struct Certificate {
        string contentHash;
        uint256 timestampCaptured;
        string deviceId;
        address creator;
        uint256 mintedAt;
    }

    // Token ID => Certificate data
    mapping(uint256 => Certificate) public certificates;

    // Content hash => Token ID (prevent duplicates)
    mapping(string => uint256) public hashToTokenId;

    // Events
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string contentHash,
        string deviceId,
        uint256 timestampCaptured
    );

    constructor() ERC721("RealityCertificate", "RCERT") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @notice Mint a new Reality Certificate
     * @param contentHash SHA-256 hash of the content
     * @param timestampCaptured Unix timestamp when content was captured
     * @param deviceId Identifier of the capture device
     * @param creator Address of the content creator
     */
    function mintCertificate(
        string calldata contentHash,
        uint256 timestampCaptured,
        string calldata deviceId,
        address creator
    ) external onlyOwner returns (uint256) {
        require(bytes(contentHash).length > 0, "Content hash required");
        require(hashToTokenId[contentHash] == 0, "Content already certified");
        require(creator != address(0), "Invalid creator address");

        uint256 tokenId = _nextTokenId++;
        _safeMint(creator, tokenId);

        certificates[tokenId] = Certificate({
            contentHash: contentHash,
            timestampCaptured: timestampCaptured,
            deviceId: deviceId,
            creator: creator,
            mintedAt: block.timestamp
        });

        hashToTokenId[contentHash] = tokenId;

        emit CertificateMinted(tokenId, creator, contentHash, deviceId, timestampCaptured);

        return tokenId;
    }

    /**
     * @notice Get certificate data by token ID
     */
    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        require(tokenId > 0 && tokenId < _nextTokenId, "Certificate does not exist");
        return certificates[tokenId];
    }

    /**
     * @notice Get token ID by content hash
     */
    function getTokenByHash(string calldata contentHash) external view returns (uint256) {
        uint256 tokenId = hashToTokenId[contentHash];
        require(tokenId > 0, "No certificate for this hash");
        return tokenId;
    }

    /**
     * @notice TRANSFER LOCK — Certificates are non-transferable (soulbound)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)) but block transfers
        if (from != address(0) && to != address(0)) {
            revert("RealityCertificate: non-transferable");
        }
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Total number of certificates minted
     */
    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}
