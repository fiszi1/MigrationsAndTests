let Horse = artifacts.require("Horse");
let Farmer = artifacts.require("Farmer");
let StringComparer = artifacts.require("StringComparer");

let horse = null;
let farmer = null;
let horseAddress = null;
const MEAT = "meat";
const PLANT = "plant";


contract("Horse and Farmer", async(accounts) => {

    it("Horse has the correct name", async() => {
        horse = await Horse.deployed();
        let name1 = "Horhe";
        let horseName;
        try{
            horseName = await horse.getName();
        } catch(e){
            console.log(e.message);
        }

        assert.equal(name1, horseName, "Error! Check horse name");
    });

    it("Horse can sleep", async() => {
        let sleep = "ZzZzZz...";
        let sleepFunction;
        try{
            sleepFunction = await horse.sleep();
        } catch(e) {
            console.log(e.message);
        }

        assert.equal(sleep, sleepFunction, "Error! Horse is not sleeping.");
    });

    it("Horse can eat plant", async()=> {
       let feedPlant;
       let result = "Animal eat plant";
       try{
           feedPlant = await horse.eat(PLANT);
       } catch(e) {
           console.log(e.message);
       }

       assert.equal(result, feedPlant, "Animal should eat plant.");
    });

    it("Horse cannot eat meat, not-food, plastic", async() => {
        let feedMEAT = await handleErrorFood(MEAT);
        let notFood = await handleErrorFood("not food");
        let plastic = await handleErrorFood("plastic");

        assert.isTrue(feedMEAT.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(notFood.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(plastic.indexOf("revert") >= 0, "Expected error message differs from what is extected");
    })

    it("Farmer can call Horse, Horse responds correctly. `Neigh` або інші відповідні звуки які видає ваш контракт Horse.",
        async () => {
            farmer = await Farmer.deployed();
            let respond = "neigh!";
            horseAddress = horse.address;
            let speak;
            try {
                speak = await farmer.speak(horseAddress);
            } catch(e) {
                console.log(e.message);
            }

            assert.equal(respond, speak, "Error! Horse need to respond neigh!");
        });

    it("Farmer can feed Horse with plant (if you have any other plant-based food - it is okay).", async()=> {
        let farmerFeed;
        try{
            farmerFeed = await farmer.feed(horseAddress, PLANT);
        } catch(e) {
            console.log(e.message);
        }

        let respond = "Animal eat plant";

        assert.equal(respond, farmerFeed, "Please feed Horse with plant");
    });

    it("Farmer cannot feed Horse with anything else(”meat”,”plastic”,”fingers”,etc)", async()=> {
        let feedMEAT = await handleErrorFeed(horseAddress,MEAT);
        let plastic = await handleErrorFeed(horseAddress, "plastic");
        let notFood = await handleErrorFood(horseAddress , "fingers");

        assert.isTrue(feedMEAT.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(notFood.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(plastic.indexOf("revert") >= 0, "Expected error message differs from what is extected");
    });
});



async function handleErrorFood(food) {
    let message;

    try {
        await horse.eat(food);
    } catch(e) {
        return message = e.message;
    }
}

async function handleErrorFeed(address, food) {
    let message;

    try{
        await farmer.feed(address, food);
    }catch (e) {
        return message = e.message;
    }
}