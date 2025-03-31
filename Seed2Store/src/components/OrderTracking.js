import React from 'react';

export default function OrderTracking({ currentStep }) {
    const steps = [
        "Order Pending",
        "Bid Accepted",
        "Payment Done",
        "Order Dispatched",
        "Delivered"
    ];
	if(currentStep === "Pending") currentStep = 0;
	if(currentStep === "Accepted") currentStep = 1;
	if(currentStep === "Paid") currentStep = 2;
	if(currentStep === "Dispatched") currentStep = 3;
	if(currentStep === "Delivered") currentStep = 4;

	console.log(currentStep);

    return (
        <>
            <style>
                {`
                .pt45 { padding-top: 45px; }
                .order-tracking { text-align: center; width: 24%; position: relative; display: block; }
                .order-tracking .is-complete { display: block; position: relative; border-radius: 50%; height: 30px; width: 30px; border: 0px solid #AFAFAF; background-color: #f7be16; margin: 0 auto; transition: background 0.25s linear; z-index: 2; }
                .order-tracking .is-complete:after { display: block; position: absolute; content: ''; height: 14px; width: 7px; top: -2px; bottom: 0; left: 5px; margin: auto 0; border: 0px solid #AFAFAF; border-width: 0px 2px 2px 0; transform: rotate(45deg); opacity: 0; }
                .order-tracking.completed .is-complete { border-color: #27aa80; background-color: #27aa80; }
                .order-tracking.completed .is-complete:after { border-color: #fff; border-width: 0px 3px 3px 0; width: 7px; left: 11px; opacity: 1; }
                .order-tracking p { color: #A4A4A4; font-size: 16px; margin-top: 8px; margin-bottom: 0; line-height: 20px; }
                .order-tracking.completed p { color: #000; }
                .order-tracking::before { content: ''; display: block; height: 3px; width: calc(100%); background-color: #f7be16; top: 13px; position: absolute; left: calc(-50%); z-index: 0; }
                .order-tracking:first-child:before { display: none; }
                .order-tracking.completed:before { background-color: #27aa80; }
                `}
            </style>
            <div className="container">
                <div className="flex flex-col">
                    <div className="w-full pt-5 pb-5">
                        <div className="flex justify-between">
                            {steps.map((step, index) => (
                                <div key={index} className={`order-tracking ${index <= currentStep ? 'completed' : ''}`}>
                                    <span className="is-complete"></span>
                                    <p>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
