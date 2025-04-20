import { ContractData } from "contracts";

import { useTransactionStore } from "../hooks/useTransactionStore";

enum Status {Initial, Loading, Success, Revert};

export function StoreNumber({ contractData }: { contractData: ContractData }) {

  const { status, setAmount, submit } = useTransactionStore(contractData);

  return (
    <div className="border rounded-md my-5 mx-2 p-2 w-fit inline-block">
      <span className="px-2 block mb-2">Store number</span>


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
  );
}
