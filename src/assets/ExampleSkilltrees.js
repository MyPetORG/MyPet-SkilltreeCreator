const ride = {
  "Name": "ride",
  "DisplayName": "Ride",
  "Description": [
    "Ride your pet"
  ],
  "Icon": "minecraft:stained_hardened_clay 1 4 {}",
  "MaxLevel": 10,
  "RequiredLevel": 0,
  "Permission": "RideA",
  "Inherits": "mini-ride",
  "MobTypes": [
    "Wolf",
    "Pig"
  ],
  "Slot": 0,
  "Skills": {
    "Ride": {
      "Upgrades": {
        "1": {
          "SpeedPercent": 5,
          "JumpHeight": 1.25,
          "CanFly": false
        },
        "%3<20": {
          "SpeedPercent": 5
        }
      }
    },
    "Beacon": {
      "Upgrades": {
        "1": {
          "SpeedPercent": 5,
          "JumpHeight": 1.25,
          "CanFly": false
        },
        "%3<20": {
          "SpeedPercent": 5
        }
      }
    }
  }
};
const beacon = {
  "Name": "beacon",
  "DisplayName": "Beacon",
  "Description": [
    "Beacon Beacon Beacon"
  ],
  "Icon": "minecraft:stained_hardened_clay 1 4 {}",
  "MaxLevel": 10,
  "RequiredLevel": 0,
  "Permission": "BeaconA",
  "Inherits": "mini-ride",
  "MobTypes": [
    "*",
    "-Pig"
  ],
  "Slot": 1,
  "Skills": {
    "Beacon": {
      "Upgrades": {
        "2": {
          "SpeedPercent": 5,
          "JumpHeight": 1.25,
          "CanFly": false
        },
        "%3>20": {
          "SpeedPercent": 5
        }
      }
    }
  }
};

export default [ride, beacon]