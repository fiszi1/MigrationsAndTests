let Dog = artifacts.require("Dog");
let Farmer = artifacts.require("Farmer");
let StringComparer = artifacts.require("StringComparer");

let dog;
let farmer;
const PLANT = "plant";
const MEAT = "meat";
const plantResult = "Animal eat plant";
const meatResult =  "Animal eat meat";
let dogAddress;



contract("Dog and Farmer", async(accounts)=> {

    it("Dog has the correct name.", async()=>{
        dog = await Dog.deployed();
        let name = "Jack";
        let dogName;
        try{
            dogName = await dog.getName();
        } catch(e){
            console.log(e.message);
        }

        assert.equal(name, dogName, "Error. Check dog's name");
    });

    it("Dog can sleep.", async()=> {
        let sleep = "ZzZzZz...";
        let testSleep;
        try{
            testSleep = await dog.sleep();
        } catch (e) {
            console.log(e.message);
        }

        assert.equal(sleep, testSleep, "Error, check dog.sleep function.");
    });

    it("Dog can eat “plant”.", async()=> {
        let feedPlant;
        try{
            feedPlant = await dog.eat(PLANT);
        } catch (e) {
            console.log(e.message);
        }

        assert.equal(plantResult, feedPlant, "please change input, dog need to eat plant");
    });

    it("Dog can eat ”meat”.", async()=>{
        let feedMeat;
        try{
            feedMeat = await dog.eat(MEAT);
        } catch(e) {
            console.log(e.message);
        }

        assert.equal(meatResult, feedMeat, "Input is not meat!");
    });

    it("Dog cannot eat ”not-food”, ”plastic”, ”chocolate”.", async()=>{
        let feedChoco = await handleErrorFood("chocolate");
        let notFood = await handleErrorFood("not food");
        let plastic = await handleErrorFood("plastic");

        assert.isTrue(feedChoco.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(notFood.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(plastic.indexOf("revert") >= 0, "Expected error message differs from what is extected");
    });

    it("Farmer can call Dog, Dog responds correctly.", async()=>{
        farmer = await Farmer.deployed();
        let respond = "Woof";
        dogAddress = dog.address;
        let speak;

        try{
            speak = await farmer.speak(dogAddress);
        } catch(e) {
            console.log(e.message);
        }

        assert.equal(respond, speak, "Expected error message differs from what is extected");
    });

    it("Farmer can feed Dog with ”meat”,”plant”.", async()=>{
        let feedPlant;
        feedPlant = await farmer.feed(dogAddress, PLANT);
        let feedMeat;
        feedMeat = await farmer.feed(dogAddress, MEAT);

        assert(plantResult, feedPlant, "Input is not plant");
        assert(meatResult, feedMeat, "Input is not meat");
    })

    it("Farmer cannot feed Dog with ”not-food”, ”plastic” and anything else.", async()=>{
        let notFood = await handleErrorFeed(dogAddress,"not-food");
        let plastic = await handleErrorFeed(dogAddress, "plastic");
        let chocolate = await handleErrorFood(dogAddress ,"chocolate");

        assert.isTrue(chocolate.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(notFood.indexOf("revert") >= 0, "Expected error message differs from what is expected");
        assert.isTrue(plastic.indexOf("revert") >= 0, "Expected error message differs from what is extected");
    })

    async function handleErrorFood(food) {
        let message;

        try {
            await dog.eat(food);
        } catch(e) {
            return message = e.message;
        }
    }

    async function farmerFeed(address, food){
        let message;

        try {
            await farmer.feed(address, food);
        } catch(e) {
            console.log("ERROR HERE");
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
});