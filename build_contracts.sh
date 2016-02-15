#!/bin/bash

rm -rf test
mkdir test

rm -rf token
mkdir token

solc --abi contracts/token.sol -o token
solc --bin contracts/token.sol -o token