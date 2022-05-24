import { Icon } from "@iconify/react";
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
SearchInput.propTypes = {
    handleChangeSearch: PropTypes.func,
}
export default function SearchInput({ handleChangeSearch, size = "md", button = true }) {
    const { t } = useTranslation();
    const handleChange = (e) => {
        handleChangeSearch(e.target.value)
    }
    return (
        <div className="flex items-center  border rounded-lg ">
            <div className="flex-none ml-2"><Icon icon="fa:search" className="text-info" /></div>
            <input type="text" className={`input max-w-[180px] md:max-w-[250px] grow input-${size}`} onChange={handleChange} />
            {button &&
                <button className={`btn btn-info flex-none btn-outline border-l-radius md:block hidden btn-${size}`}>{t('words.search')}</button>
            }
        </div>
    )
}