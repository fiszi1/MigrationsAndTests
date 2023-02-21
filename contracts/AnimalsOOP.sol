pragma solidity ^0.8.17;

interface Living {
    function eat(string memory food) external returns (string memory);
    function sleep() external returns (string memory);
    function speak() external returns (string memory);
}

contract HasName {
    string internal _name;

    constructor(string memory name) {
        _name = name;
    }

    function getName() view public returns (string memory){
        return _name;
    }
}

contract HasAge {
    uint internal _age;

    constructor(uint age) {
        _age = age;
    }

    function getAge() view public returns (uint) {
        return _age;
    }
}

abstract contract Animal is Living {

    function eat(string memory food) view virtual public returns (string memory) {
        return string.concat(string.concat("Animal eat ",food));
    }

    function sleep() view public virtual returns (string memory) {
        return "ZzZzZz...";
    }
    
    function speak() view public virtual returns (string memory) {
        return ".....";
    }
}

library StringComparer {

   function compare(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
    
}

abstract contract Herbivore is Animal, HasName, HasAge {
    string constant PLANT = "plant";

    modifier eatOnlyPlant(string memory food) {
        require(StringComparer.compare(food, PLANT), "Herbivores eat only plants.");
        _;
    }

    function eat(string memory food) view virtual override public eatOnlyPlant(food) returns (string memory) {
        return super.eat(food);
    }
}

abstract contract Carnivore is Animal, HasName, HasAge {
    string constant MEAT = "meat";

    modifier eatOnlyMeat(string memory food) {
        require(StringComparer.compare(food, MEAT), "Carnivores eat only meat.");
        _;
    }
    
    function eat(string memory food) view public virtual override eatOnlyMeat(food) returns (string memory) {
        return super.eat(food);
    }
}

abstract  contract Omnivore is Animal, HasName, HasAge{
    string constant MEAT = "meat";
    string constant PLANT = "plant";

    modifier eatBoth(string memory food) {
        require(StringComparer.compare(food, MEAT) || StringComparer.compare(food, PLANT), "Omnivores eat plant or meat");
        _;
    }

    function eat(string memory food) view public virtual override eatBoth(food) returns (string memory) {
        return super.eat(food);
    }
}



contract Cow is Herbivore {

    constructor(string memory name, uint age) HasName(name) HasAge(age){
    }

    function speak() view public override returns (string memory) {
        return "Moooo...";
    }
}

contract Horse is Herbivore {

    constructor(string memory name, uint age) HasName(name) HasAge(age) {
    }

    function speak() view public override returns(string memory) {
        return "neigh!";
    }
}

contract Wolf is Carnivore {

    constructor(string memory name, uint age) HasName(name) HasAge(age) {
    }

    function speak() view public override returns(string memory) {
        return "Awooo...";
    }
}

contract Dog is Omnivore {
    constructor(string memory name, uint age) HasName(name) HasAge(age){
    }

    function speak() view public override returns (string memory) {
        return "Woof";
    }
 }


contract Farmer {
    //connect with address to particular animal to feed
    function feed(address animal, string memory food) view public returns (string memory) {
        return Animal(animal).eat(food);
    }

    function speak(address animal) view public returns (string memory) {
        return Animal(animal).speak();
    }
}

