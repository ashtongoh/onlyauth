import React from 'react';
import { ethers } from "ethers";
import { useContractWrite, useAccount, useContractRead } from 'wagmi';
import { mainABI, mainAddress } from "../contract"

const Card = (props) => {

    const { address, isConnected } = useAccount();

    const mint = useContractWrite({
        addressOrName: mainAddress,
        contractInterface: mainABI,
        functionName: 'mint',
        onSuccess(data) {
            console.log("Success", data);
        }
    })

    const checkOwn = useContractRead({
        addressOrName: mainAddress,
        contractInterface: mainABI,
        functionName: 'checkOwn',
        args: [address],
        onSuccess(data) {
            console.log("Success", data);
        }
    })

    const verifyAccess = useContractWrite({
        addressOrName: mainAddress,
        contractInterface: mainABI,
        functionName: 'verifyAccess',
        args: [],
        onSuccess(data) {
            console.log("Success", data);
        }
    })

    const verifySignature = useContractWrite({
        addressOrName: mainAddress,
        contractInterface: mainABI,
        functionName: 'verifySignature',
        args: [],
        onSuccess(data) {
            console.log("Success", data);
        }
    })

    const auth = () => {

    }


    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            {/* <img className="w-full bg-[#1E0536]" src="" alt="Sunset in the mountains"></img> */}
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Influencer</div>
                <p className="text-gray-700 text-base">
                    Lorem ipsum dolor sit amet.
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <span className="text-[#FAAA39]">Lorem ipsum sae tom axen ziaq</span>
            </div>
            <div className="px-6 pt-4 pb-7 py-5">
                <div className="flex space-x-10">
                    <button className="bg-[#FAAA39] rounded-md py-2 px-3" disabled={props.status} onClick={() => { mint.write(); }}>Subscribe</button>
                    <button className="bg-[#FAAA39] rounded-md py-2 px-3" disabled={props.status}>Access</button>
                </div>
            </div>
        </div>
    );
};
export default Card;