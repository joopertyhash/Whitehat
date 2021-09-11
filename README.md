# Whitehat Rescue Simulator

This repo provides a full simulated whitehat rescue experience. Anyone who can read JS/TS can pick through this repo and learn how it all works, from attack to recovery.

## Contents

Assume the attacker always has the private key.

### Staking Platform, Recoverable Assets

- An ERC20 is staked in a staking platform
- Assets are time-locked
- Goerli deploy script

### Attacker Script

Black-hat tools that simulate a relatively knowledgeable attacker's environment & attack plan.

- Black-hat front-runner script
- Simple withdrawal script

### Rescue Simulation Suite

Tools that whitehats use to recover funds and protect compromised accounts from further theft.

- Burner
- Hardhat sim on Goerli w/ timestamp alteration
- Flashbots sim on Goerli w/ timestamp alteration
