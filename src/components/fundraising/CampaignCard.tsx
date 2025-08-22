/* eslint-disable @next/next/no-img-element */
import React from "react";

type Props = {
  campaign: {
    _id: string;
    title: string;
    reason: string;
    imageUrl: string;
    requiredAmount: number;
    fundedAmount: number;
    stripeAccountId:string;
  };
};

const CampaignCard: React.FC<Props> = ({ campaign }) => {
  return (
    <div className="p-4 w-full h-full border rounded shadow-sm bg-white">
      <img
        src={campaign.imageUrl}
        alt={campaign.title}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-xl font-semibold mb-1">{campaign.title}</h3>
      <p className="text-gray-600 mb-2 text-sm">{campaign.reason}</p>
      <div className="text-sm font-medium">
        <span className="text-blue-600">Funded:</span> ${campaign.fundedAmount} / ${campaign.requiredAmount}
      </div>
    </div>
  );
};

export default CampaignCard;
