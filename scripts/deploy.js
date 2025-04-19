async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Instagram = await ethers.getContractFactory("Instagram");
  const instagram = await Instagram.deploy();

  await instagram.deployed();

  console.log("Instagram contract deployed to:", instagram.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
