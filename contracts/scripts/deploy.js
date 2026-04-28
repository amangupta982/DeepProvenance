const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying RealityCertificate to Polygon zkEVM...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  const RealityCertificate = await ethers.getContractFactory("RealityCertificate");
  const certificate = await RealityCertificate.deploy();
  await certificate.waitForDeployment();

  const address = await certificate.getAddress();
  console.log("✅ RealityCertificate deployed to:", address);
  console.log("📋 Save this address in your .env as CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
