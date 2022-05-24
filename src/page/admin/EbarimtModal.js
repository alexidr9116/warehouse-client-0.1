import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { API_PAYMENT, SEND_POST_REQUEST } from "../../utils/API";
import { useTranslation } from "react-i18next";
import QRcode from "react-qr-code";
import toast from 'react-hot-toast'

EbarimtInvoiceModal.propTypes = {
  onClose: PropTypes.func,
  invoiceID: PropTypes.string,
};

export default function EbarimtInvoiceModal({ onClose, invoiceID }) {
  const [ebarimt, setEbarimt] = useState({});
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    SEND_POST_REQUEST(API_PAYMENT.getEbarimt, { invoice_id: invoiceID }).then(
      (res) => {
        setLoading(false)
        if (res.status === 200) {
          setEbarimt(res.data.ebarimt.data);
        }
        else {
          toast.error(res?.message || "Whoops, Can not get Ebarimt");
        }
      }
    );
  }, [invoiceID]);
  return (
    <div className={`modal modal-open bg-black/0 sm:modal-middle modal-bottom`}>
      <div className=" fixed inset-0 bg-black/80" onClick={onClose} />
      <div className="z-50 bg-white rounded-2xl py-5 px-3 w-full sm:w-2/3 md:w-1/2 m-2 ">
        <div className="flex">
          <Icon
            icon="arcticons:ebarimt"
            width={80}
            height={80}
            className="text-bold"
          />
        </div>
        <div className="flex mb-3">
          <label className="text-xs font-bold">EBARLIMT.MN</label>
        </div>
        <div className="flex flex-col mb-3">
          {!loading &&
            <>
              <label>Created:{ebarimt?.created_date}</label>
              <label>Amount:{ebarimt?.amount}</label>
              <label>CTA:{ebarimt?.city_tax_amount}</label>
              <label>VTA:{ebarimt?.vat_amount}</label>
              <label>Branch:{ebarimt?.merchant_branch_code}</label>
            </>
          }

          {loading &&
            <>
              <div className="flex items-center">Created:<div class="h-2 bg-slate-200 rounded w-1/2 animate-pulse"></div></div>
              <div className="flex items-center">Amount:<div class="h-2 bg-slate-200 rounded w-1/3 animate-pulse "></div></div>
              <div className="flex items-center">CTA:<div class="h-2 bg-slate-200 rounded w-1/4 animate-pulse "></div></div>
              <div className="flex items-center">VTA:<div class="h-2 bg-slate-200 rounded w-1/4 animate-pulse"></div></div>
              <div className="flex items-center">Branch:<div class="h-2 bg-slate-200 rounded w-1/3 animate-pulse "></div></div>
            </>
          }
        </div >
        <div className="flex flex-col items-center justify-center mb-5">
          <div className="font-bold text-lg flex w-full items-center justify-center">
            Lottery:{ebarimt?.ebarimt_lottery} {loading && <div class="h-5 bg-slate-200 rounded w-1/3 animate-pulse"></div>}
          </div>
          <QRcode value={`${ebarimt?.ebarimt_qr_data}`} size={150} />

        </div>
        <div className="flex justify-center">
          <button className="btn btn-info px-8 btn-sm " onClick={onClose}>Close</button>
        </div>
      </div >
    </div >
  );
}
