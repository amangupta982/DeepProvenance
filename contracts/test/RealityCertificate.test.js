const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealityCertificate", function () {
  let certificate;
  let owner, creator, otherUser;

  beforeEach(async function () {
    [owner, creator, otherUser] = await ethers.getSigners();
    const RealityCertificate = await ethers.getContractFactory("RealityCertificate");
    certificate = await RealityCertificate.deploy();
    await certificate.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should set the correct name and symbol", async function () {
      expect(await certificate.name()).to.equal("RealityCertificate");
      expect(await certificate.symbol()).to.equal("RCERT");
    });

    it("should set deployer as owner", async function () {
      expect(await certificate.owner()).to.equal(owner.address);
    });

    it("should start with 0 minted certificates", async function () {
      expect(await certificate.totalMinted()).to.equal(0);
    });
  });

  describe("Minting", function () {
    const contentHash = "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069";
    const deviceId = "CANON-EOS-R5-SN4823";
    const timestamp = Math.floor(Date.now() / 1000);

    it("should mint a certificate successfully", async function () {
      const tx = await certificate.mintCertificate(contentHash, timestamp, deviceId, creator.address);
      await tx.wait();

      expect(await certificate.totalMinted()).to.equal(1);
      expect(await certificate.ownerOf(1)).to.equal(creator.address);
    });

    it("should emit CertificateMinted event", async function () {
      await expect(certificate.mintCertificate(contentHash, timestamp, deviceId, creator.address))
        .to.emit(certificate, "CertificateMinted")
        .withArgs(1, creator.address, contentHash, deviceId, timestamp);
    });

    it("should store certificate data correctly", async function () {
      await certificate.mintCertificate(contentHash, timestamp, deviceId, creator.address);
      const cert = await certificate.getCertificate(1);

      expect(cert.contentHash).to.equal(contentHash);
      expect(cert.deviceId).to.equal(deviceId);
      expect(cert.creator).to.equal(creator.address);
      expect(cert.timestampCaptured).to.equal(timestamp);
    });

    it("should map content hash to token ID", async function () {
      await certificate.mintCertificate(contentHash, timestamp, deviceId, creator.address);
      expect(await certificate.getTokenByHash(contentHash)).to.equal(1);
    });

    it("should revert on duplicate content hash", async function () {
      await certificate.mintCertificate(contentHash, timestamp, deviceId, creator.address);
      await expect(
        certificate.mintCertificate(contentHash, timestamp, deviceId, creator.address)
      ).to.be.revertedWith("Content already certified");
    });

    it("should revert with empty content hash", async function () {
      await expect(
        certificate.mintCertificate("", timestamp, deviceId, creator.address)
      ).to.be.revertedWith("Content hash required");
    });

    it("should revert with zero address creator", async function () {
      await expect(
        certificate.mintCertificate(contentHash, timestamp, deviceId, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid creator address");
    });

    it("should only allow owner to mint", async function () {
      await expect(
        certificate.connect(otherUser).mintCertificate(contentHash, timestamp, deviceId, creator.address)
      ).to.be.revertedWithCustomError(certificate, "OwnableUnauthorizedAccount");
    });

    it("should increment token IDs", async function () {
      await certificate.mintCertificate(contentHash, timestamp, deviceId, creator.address);
      await certificate.mintCertificate("hash2", timestamp, deviceId, otherUser.address);
      expect(await certificate.totalMinted()).to.equal(2);
      expect(await certificate.ownerOf(2)).to.equal(otherUser.address);
    });
  });

  describe("Non-transferability", function () {
    const contentHash = "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069";

    beforeEach(async function () {
      await certificate.mintCertificate(contentHash, Math.floor(Date.now() / 1000), "DEVICE", creator.address);
    });

    it("should revert on transfer", async function () {
      await expect(
        certificate.connect(creator).transferFrom(creator.address, otherUser.address, 1)
      ).to.be.revertedWith("RealityCertificate: non-transferable");
    });

    it("should revert on safeTransferFrom", async function () {
      await expect(
        certificate.connect(creator)["safeTransferFrom(address,address,uint256)"](creator.address, otherUser.address, 1)
      ).to.be.revertedWith("RealityCertificate: non-transferable");
    });
  });

  describe("Queries", function () {
    it("should revert getCertificate for non-existent token", async function () {
      await expect(certificate.getCertificate(999)).to.be.revertedWith("Certificate does not exist");
    });

    it("should revert getTokenByHash for non-existent hash", async function () {
      await expect(certificate.getTokenByHash("nonexistent")).to.be.revertedWith("No certificate for this hash");
    });
  });
});
