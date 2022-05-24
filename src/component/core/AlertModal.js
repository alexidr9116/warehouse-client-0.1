import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
AlertModal.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    onAccept: PropTypes.func,
    onCancel: PropTypes.func
}
export default function AlertModal({ title, description, onAccept, onCancel }) {
    return (
        <div className="modal bg-black/25 modal-open modal-bottom sm:modal-middle cursor-pointer">
            <div className="modal-box relative">
                <div className="flex gap-2 mb-4">
                    <div className="">
                        <Icon icon="fa:fa-angellist" width={30} height={30} className="text-sky-500" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-stone-700 font-bold">{title}</label>
                        <p className="text-stone-500">{description}</p>
                    </div>
                </div>
                <div className="w-full flex gap-2 justify-between">
                    <button className={`btn btn-info w-1/2 -ml-1 uppercase btn-sm`} onClick={onAccept}>
                        Ok
                    </button>
                    <button className={`btn btn-info w-1/2  btn-sm uppercase`} onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div >
    );
}