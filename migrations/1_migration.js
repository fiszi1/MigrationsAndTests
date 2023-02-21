//     Написати міграцію, в якій:
//     1) будуть завантажуватись в блокчейн смарт-контракти Cow, Horse, Wolf і Farmer з ДЗ №9;
//
//     2) по черзі відбуватимуться 2 виклики методу Farmer.call(<address>),
//        де <address> є спершу адреса контракта Cow, потім Horse.

//     3) Після кожного виклику в консоль повинно виводитись результат виклику (“Moooo” або “Igogo”);
//     4) далі відбувається 2 виклики методу Farmer.feed(<address>,<food>),
//        де в обох випадках <address> є адреса контракту Wolf, а <food> в першому випадку є “plant”,
//        а в другому – “meat”. В консоль має виводитись результати обох викликів (в першому випадку вовк “не з’їсть” “plant”,
//        але в другому із задоволенням “з’їсть” “meet”).


let Cow = artifacts.require("Cow");
let Horse = artifacts.require("Horse");
let Wolf = artifacts.require("Wolf");
let Farmer = artifacts.require("Farmer");
let Dog = artifacts.require("Dog");
let StringComparer = artifacts.require("StringComparer");


let farmer = null;
let cow = null;
let horse = null;
let wolf = null;
let dog = null;

const MEAT = "meat";
const PLANT = "plant";


module.exports = async(deployer) => {

    //Link library to contracts
    await deployer.deploy(StringComparer);
    await deployer.link(StringComparer, [Cow, Horse, Wolf, Dog]);

    await deployer.deploy(Cow, "Masha", 29);
    cow = await Cow.deployed();

    await deployer.deploy(Horse, "Horhe", 12);
    horse = await Horse.deployed();

    await deployer.deploy(Wolf, "Myhailo", 2);
    wolf = await Wolf.deployed();

    await deployer.deploy(Farmer);
    farmer = await Farmer.deployed();

    await deployer.deploy(Dog, "Jack", 1);
    dog = await Dog.deployed();

    console.log("---------------------");
    let call1 = await call(cow.address);
    console.log(call1);
    console.log("---------------------");

    let call2 = await call(horse.address);
    console.log(call2);
    console.log("---------------------");

    let feed1 = null;
        try {
            feed1 = await feed(wolf.address, PLANT);
            console.log(feed1);
        }catch(e){
            if(e.message.indexOf("revert") >= 0) {
                console.log("Wolfs eat only meat. Please do not feed them with " + PLANT);
            }
        }
    console.log("---------------------");

    let feed2 = null;
        try{
            feed2 = await feed(wolf.address, MEAT);
            console.log(feed2)
        } catch(e) {
            if(e.message.indexOf("revert") >= 0) {
                console.log("Wolfs eat only meat. Please do not feed them with " + PLANT);
            }
        }

    console.log("---------------------");

}

async function call(address) {
    return await farmer.speak(address);
}

async function feed(address, food) {
    return await farmer.feed(address, food);
}
