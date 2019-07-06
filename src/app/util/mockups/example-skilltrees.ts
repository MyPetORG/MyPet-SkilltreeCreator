export const CombatSkilltree = {
  'Order': 0,
  'Description': [
    '- <red><bold>Damage',
    '- <green><bold>Hp Regeneration',
    '- <red><bold>Thorns',
    '- <blue><bold>Knockback'
  ],
  'Skills': {
    'Backpack': {
      'Upgrades': {
        '6': {
          'drop': false,
          'rows': '+1'
        }
      }
    },
    'Control': {
      'Upgrades': {
        '7': {
          'Active': true
        }
      }
    },
    'Life': {
      'Upgrades': {
        '4': {
          'Health': '+2'
        }
      }
    },
    'Thorns': {
      'Upgrades': {
        '5': {
          'Reflection': '+15',
          'Chance': '+10'
        },
        '9': {
          'Chance': '+8'
        }
      }
    },
    'Knockback': {
      'Upgrades': {
        '10': {
          'Chance': '+15'
        }
      }
    },
    'Heal': {
      'Upgrades': {
        '2': {
          'Health': '+1'
        }
      }
    },
    'Behavior': {
      'Upgrades': {
        '1': {
          'Friend': false,
          'Farm': false,
          'Duel': true,
          'Aggro': false,
          'Raid': false
        },
        '3': {
          'Friend': true,
          'Farm': false,
          'Duel': true,
          'Aggro': true,
          'Raid': false
        }
      }
    },
    'Damage': {
      'Upgrades': {
        '1': {
          'Damage': '+1.5'
        },
        '3': {
          'Damage': '+1.5'
        },
        '6': {
          'Damage': '+1.5'
        },
        '8': {
          'Damage': '+1.5'
        }
      }
    }
  },
  'MobTypes': [
    '*'
  ],
  'ID': 'Combat',
  'Icon': {
    'Material': 'minecraft:stone_axe'
  }
};

export const FarmSkilltree = {
  'Order': 4,
  'Description': [
    '- <red><bold>Melee<r> + <red><bold>Ranged Attack',
    '- <yellow><bold>Inventory',
    '- <red><bold>Thorns',
    '- <red><bold>Poison',
    '- <blue><bold>Control'
  ],
  'Skills': {
    'Ranged': {
      'Upgrades': {
        '7': {
          'Rate': '+35',
          'Damage': '+2',
          'Projectile': 'Arrow'
        }
      }
    },
    'Backpack': {
      'Upgrades': {
        '1': {
          'drop': false,
          'rows': '+1'
        },
        '5': {
          'drop': false,
          'rows': '+1'
        }
      }
    },
    'Control': {
      'Upgrades': {
        '8': {
          'Active': true
        }
      }
    },
    'Pickup': {
      'Upgrades': {
        '2': {
          'Range': '+1',
          'Exp': false
        },
        '10': {
          'Range': '+5',
          'Exp': false
        }
      }
    },
    'Thorns': {
      'Upgrades': {
        '6': {
          'Reflection': '+10',
          'Chance': '+20'
        }
      }
    },
    'Poison': {
      'Upgrades': {
        '9': {
          'Duration': '+2',
          'Chance': '+20'
        }
      }
    },
    'Behavior': {
      'Upgrades': {
        '4': {
          'Friend': true,
          'Farm': true,
          'Duel': true,
          'Aggro': true,
          'Raid': true
        }
      }
    },
    'Damage': {
      'Upgrades': {
        '3': {
          'Damage': '+2'
        },
        '5': {
          'Damage': '+0.5'
        }
      }
    }
  },
  'MobTypes': [
    '*'
  ],
  'ID': 'Farm',
  'Icon': {
    'Material': 'minecraft:writable_book'
  }
};

export const PvpSkilltree = {
  'Order': 2,
  'Description': [
    '- <red><bold>Damage',
    '- <blue><bold>Sprint',
    '- <red><bold>Slow',
    '- <red><bold>Fire',
    '- <yellow><bold>Beacon'
  ],
  'Skills': {
    'Backpack': {
      'Upgrades': {
        '6': {
          'drop': false,
          'rows': '+1'
        }
      }
    },
    'Control': {
      'Upgrades': {
        '3': {
          'Active': true
        }
      }
    },
    'Slow': {
      'Upgrades': {
        '4': {
          'Duration': '+2',
          'Chance': '+10'
        },
        '9': {
          'Duration': '+1',
          'Chance': '+5'
        }
      }
    },
    'Fire': {
      'Upgrades': {
        '5': {
          'Duration': '+3',
          'Chance': '+15'
        }
      }
    },
    'Beacon': {
      'Upgrades': {
        '7': {
          'Duration': '+8',
          'Range': '+5'
        },
        '10': {
          'Duration': '+8',
          'Range': '+5'
        }
      }
    },
    'Life': {
      'Upgrades': {
        '9': {
          'Health': '+5'
        }
      }
    },
    'Heal': {
      'Upgrades': {
        '8': {
          'Timer': '+60',
          'Health': '+4'
        }
      }
    },
    'Behavior': {
      'Upgrades': {
        '3': {
          'Friend': true,
          'Farm': false,
          'Duel': true,
          'Aggro': false,
          'Raid': false
        }
      }
    },
    'Sprint': {
      'Upgrades': {
        '4': {
          'Active': true
        }
      }
    },
    'Damage': {
      'Upgrades': {
        '1': {
          'Damage': '+1.5'
        },
        '2': {
          'Damage': '+1.5'
        },
        '5': {
          'Damage': '+0.5'
        }
      }
    }
  },
  'MobTypes': [
    '*'
  ],
  'ID': 'PvP',
  'Icon': {
    'Material': 'minecraft:diamond_sword'
  }
};

export const RideSkilltree = {
  'Order': 3,
  'Description': [
    '- <yellow><bold>Ride',
    '- <red><bold>Ranged Attacks',
    '- Small <yellow><bold>Inventory <r>+ <yellow><bold>Pickup',
    '- <blue><bold>Sprint',
    '- <red><bold>Thorns',
    '- <yellow><bold>Beacon<r> (Speed)'
  ],
  'Skills': {
    'Ranged': {
      'Upgrades': {
        '2': {
          'Rate': '+35',
          'Damage': '+2',
          'Projectile': 'Snowball'
        }
      }
    },
    'Backpack': {
      'Upgrades': {
        '3': {
          'drop': false,
          'rows': '+2'
        },
        '5': {
          'drop': false,
          'rows': '+1'
        }
      }
    },
    'Control': {
      'Upgrades': {
        '6': {
          'Active': true
        }
      }
    },
    'Pickup': {
      'Upgrades': {
        '4': {
          'Range': '+1',
          'Exp': false
        }
      }
    },
    'Thorns': {
      'Upgrades': {
        '9': {
          'Reflection': '+20',
          'Chance': '+50'
        }
      }
    },
    'Beacon': {
      'Upgrades': {
        '10': {
          'Duration': '+8',
          'Range': '+10'
        }
      }
    },
    'Behavior': {
      'Upgrades': {
        '2': {
          'Friend': false,
          'Farm': false,
          'Duel': true,
          'Aggro': false,
          'Raid': false
        },
        '7': {
          'Friend': true,
          'Farm': false,
          'Duel': true,
          'Aggro': false,
          'Raid': false
        }
      }
    },
    'Sprint': {
      'Upgrades': {
        '8': {
          'Active': true
        }
      }
    },
    'Ride': {
      'Upgrades': {
        '1': {
          'Speed': '+5',
          'JumpHeight': '+1.25'
        },
        '10': {
          'CanFly': true
        }
      }
    }
  },
  'MobTypes': [
    '*'
  ],
  'ID': 'Ride',
  'Icon': {
    'Material': 'minecraft:saddle',
    'Glowing': true
  }
};

export const UtilitySkilltree = {
  'Order': 1,
  'Description': [
    '- <yellow><bold>Inventory',
    '- <green><bold>More HP',
    '- <yellow><bold>Pickup',
    '- <red><bold>Poison'
  ],
  'Skills': {
    'Backpack': {
      'Upgrades': {
        '1': {
          'drop': true,
          'rows': '+1'
        },
        '3': {
          'drop': false,
          'rows': '+1'
        },
        '5': {
          'drop': false,
          'rows': '+1'
        },
        '7': {
          'drop': false,
          'rows': '+1'
        },
        '10': {
          'drop': false,
          'rows': '+2'
        }
      }
    },
    'Pickup': {
      'Upgrades': {
        '6': {
          'Range': '+1',
          'Exp': false
        },
        '9': {
          'Range': '+1',
          'Exp': false
        }
      }
    },
    'Life': {
      'Upgrades': {
        '2': {
          'Health': '+1.5'
        },
        '5': {
          'Health': '+3'
        },
        '8': {
          'Health': '+5'
        }
      }
    },
    'Poison': {
      'Upgrades': {
        '4': {
          'Duration': '+3',
          'Chance': '+15'
        }
      }
    },
    'Heal': {
      'Upgrades': {
        '2': {
          'Timer': '+45',
          'Health': '+2'
        }
      }
    },
    'Behavior': {
      'Upgrades': {
        '4': {
          'Friend': false,
          'Farm': false,
          'Duel': true,
          'Aggro': false,
          'Raid': false
        }
      }
    },
    'Damage': {
      'Upgrades': {
        '4': {
          'Damage': '+1.5'
        }
      }
    }
  },
  'MobTypes': [
    '*'
  ],
  'ID': 'Utility',
  'Icon': {
    'Material': 'minecraft:trapped_chest'
  }
};
