const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract")
    const simpleStorage = await SimpleStorageFactory.deploy()
    console.log(`Deployed contract to: ${await simpleStorage.getAddress()}`)

    if (network.config.chainId === 1115511 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await simpleStorage.deploymentTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    console.log("Updating favorite number...")
    const transactionResponse = await simpleStorage.store("7")
    await transactionResponse.wait(1)
    const retrieveNumber = await simpleStorage.retrieve()
    console.log(`New favorite Number: ${retrieveNumber}`)
}

async function verify(constAddress, args) {
    console.log("Verifying contract")
    try {
        await run("verify:verify", {
            address: constAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
