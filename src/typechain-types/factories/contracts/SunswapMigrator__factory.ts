/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  SunswapMigrator,
  SunswapMigratorInterface,
} from "../../contracts/SunswapMigrator";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_factoryV1",
        type: "address",
      },
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountTokenMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountETHMin",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60c060405234801561001057600080fd5b506040516109443803806109448339818101604052604081101561003357600080fd5b5080516020909101516001600160601b0319606092831b8116608052911b1660a05260805160601c60a05160601c6108bd6100876000398061030752806103775280610409525080608352506108bd6000f3fe6080604052600436106100225760003560e01c8063b7df1d251461002e57610029565b3661002957005b600080fd5b34801561003a57600080fd5b5061007d600480360360a081101561005157600080fd5b506001600160a01b0381358116916020810135916040820135916060810135909116906080013561007f565b005b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166306f2bf62876040518263ffffffff1660e01b815260040180826001600160a01b03166001600160a01b0316815260200191505060206040518083038186803b1580156100f757600080fd5b505afa15801561010b573d6000803e3d6000fd5b505050506040513d602081101561012157600080fd5b5051604080516370a0823160e01b815233600482015290519192506000916001600160a01b038416916370a08231916024808301926020929190829003018186803b15801561016f57600080fd5b505afa158015610183573d6000803e3d6000fd5b505050506040513d602081101561019957600080fd5b5051604080516323b872dd60e01b81523360048201523060248201526044810183905290519192506001600160a01b038416916323b872dd916064808201926020929091908290030181600087803b1580156101f457600080fd5b505af1158015610208573d6000803e3d6000fd5b505050506040513d602081101561021e57600080fd5b5051610268576040805162461bcd60e51b81526020600482015260146024820152731514905394d1915497d19493d357d1905253115160621b604482015290519081900360640190fd5b60408051637c45f8ad60e11b81526004810183905260016024820181905260448201526000196064820152815160009283926001600160a01b0387169263f88bf15a9260848084019391929182900301818787803b1580156102c957600080fd5b505af11580156102dd573d6000803e3d6000fd5b505050506040513d60408110156102f357600080fd5b508051602090910151909250905061032c897f000000000000000000000000000000000000000000000000000000000000000083610462565b6040805163f305d71960e01b81526001600160a01b038b8116600483015260248201849052604482018b9052606482018a9052888116608483015260a48201889052915160009283927f00000000000000000000000000000000000000000000000000000000000000009091169163f305d71991879160c480830192606092919082900301818588803b1580156103c257600080fd5b505af11580156103d6573d6000803e3d6000fd5b50505050506040513d60608110156103ed57600080fd5b5080516020909101519092509050818311156104415761042f8b7f00000000000000000000000000000000000000000000000000000000000000006000610462565b61043c8b338486036105b6565b610455565b808411156104555761045533828603610703565b5050505050505050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663095ea7b360e01b178152925182516000946060949389169392918291908083835b602083106104df5780518252601f1990920191602091820191016104c0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114610541576040519150601f19603f3d011682016040523d82523d6000602084013e610546565b606091505b5091509150818015610574575080511580610574575080806020019051602081101561057157600080fd5b50515b6105af5760405162461bcd60e51b815260040180806020018281038252602b815260200180610830602b913960400191505060405180910390fd5b5050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663a9059cbb60e01b178152925182516000946060949389169392918291908083835b602083106106335780518252601f199092019160209182019101610614565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114610695576040519150601f19603f3d011682016040523d82523d6000602084013e61069a565b606091505b50915091508180156106c85750805115806106c857508080602001905160208110156106c557600080fd5b50515b6105af5760405162461bcd60e51b815260040180806020018281038252602d81526020018061085b602d913960400191505060405180910390fd5b604080516000808252602082019092526001600160a01b0384169083906040518082805190602001908083835b6020831061074f5780518252601f199092019160209182019101610730565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146107b1576040519150601f19603f3d011682016040523d82523d6000602084013e6107b6565b606091505b50509050806107f65760405162461bcd60e51b81526004018080602001828103825260348152602001806107fc6034913960400191505060405180910390fd5b50505056fe5472616e7366657248656c7065723a3a736166655472616e736665724554483a20455448207472616e73666572206661696c65645472616e7366657248656c7065723a3a73616665417070726f76653a20617070726f7665206661696c65645472616e7366657248656c7065723a3a736166655472616e736665723a207472616e73666572206661696c6564a2646970667358221220bd9afce664cb8360f9d107d2cea3ee5c695cd8c32abc30ac3b85c544e82ce99764736f6c63430006060033";

type SunswapMigratorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SunswapMigratorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SunswapMigrator__factory extends ContractFactory {
  constructor(...args: SunswapMigratorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _factoryV1: PromiseOrValue<string>,
    _router: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SunswapMigrator> {
    return super.deploy(
      _factoryV1,
      _router,
      overrides || {}
    ) as Promise<SunswapMigrator>;
  }
  override getDeployTransaction(
    _factoryV1: PromiseOrValue<string>,
    _router: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_factoryV1, _router, overrides || {});
  }
  override attach(address: string): SunswapMigrator {
    return super.attach(address) as SunswapMigrator;
  }
  override connect(signer: Signer): SunswapMigrator__factory {
    return super.connect(signer) as SunswapMigrator__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SunswapMigratorInterface {
    return new utils.Interface(_abi) as SunswapMigratorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SunswapMigrator {
    return new Contract(address, _abi, signerOrProvider) as SunswapMigrator;
  }
}
