import { ContractData } from "contracts";
import { parseEther } from "ethers";

import { useTransactionStore } from "../hooks/useTransactionStore";

enum Status {Initial, Loading, Success, Revert};

export function AddMoney({ contractData }: { contractData: ContractData }) {

  const { status, setAmount, setMoneyAmount, submit } = useTransactionStore(contractData);

  return (
    <div className="border rounded-md my-5 mx-2 p-2 w-fit inline-block">
      <span className="px-2 block mb-2">Add money</span>

      <div>
        <div className="text-right my-2">
          <label htmlFor="amountStore" className="px-2 block mb-2 inline-block">Number</label>
          <input
            id="amountStore"
            type="number"
            placeholder="0"
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={status === Status.Loading}
            className="
                  border rounded-md padding-1 pl-2 h-10 w-24
                  focus:ring-2 focus:ring-inset focus:ring-indigo-600

                " />
        </div>
        <div className="text-right my-2">
          <label htmlFor="amountMoney" className="px-2 block mb-2 inline-block">ETH</label>
          <input
            id="amountMoney"
            type="number"
            placeholder="0.01"
            step="any"
            onChange={(e) => {
              try {
                setMoneyAmount(parseEther(e.target.value));
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (_) {
                // parseEther can't chew stuff like "1."
              }
            }}
            disabled={status === Status.Loading}
            className="
                  border rounded-md padding-1 pl-2 h-10 w-24
                  focus:ring-2 focus:ring-inset focus:ring-indigo-600

                " />
        </div>
        <button onClick={submit} disabled={status === Status.Loading} className="
                  my-0 mx-3 h-10 py-0
                  focus:ring-2 focus:ring-inset focus:ring-indigo-600
                ">Store {
          status === Status.Loading ? "⏳"
            : status === Status.Success ? "✅"
              : status === Status.Revert ? "❌" : ""
        }
        </button>

      </div>
    </div>
  );
}
