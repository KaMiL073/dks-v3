/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import styles from './styles/input.module.scss';

export default function Input({ dataField, register, event }) {
  const renderInput = () => {
    switch (dataField.interface) {
      case 'select-dropdown':
        return (
          <>
            <div className={styles.selectDropdown}>
              <label htmlFor={dataField.name}>
                  {dataField.displayName}
                  <span className={dataField.required ? `text-red-700 text-lg` : `hidden`}> * </span>
              </label>
              <select {...register(dataField.name)}
                required={dataField.required ? true : undefined }
              >
                {dataField.options.map((option) => (  
                  <option
                    value={option.value}
                  >
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          </>
      );
      case 'select-radio':
        return (
          <>
            <div className={styles.radio}>
              <h4>{dataField.displayName}</h4>
              {dataField.options.map((option) => (  
                <div className="relative my-6" key={option.value}>
                  <input
                    {...register(dataField.name)}
                    type={dataField.hidden ? "hidden" : 'radio'}
                    id={`${dataField.name}_${option.value}`}
                    name={dataField.name}
                    value={option.value}
                    required={dataField.required ? true : undefined }
                  />
                  <label className="ml-2 text-sm text-dks-font" htmlFor={`${dataField.name}_${option.value}`}>
                    {option.text}
                    <span className={dataField.required ? `text-red-700 text-lg` : `hidden`}> * </span>
                  </label>
                </div>
              ))}
            </div>
          </>
        );
      case 'select-multiple-checkbox':
        return (
          <>
            <div className={dataField.hidden ? `hidden` : styles.checkbox}>
              <h4>{dataField.displayName}</h4>
              {dataField.options.map((option) => (
                <div className="relative my-6" key={option.value}>
                  <input
                    {...register(dataField.name)}
                    type={dataField.hidden ? "hidden" : 'checkbox'}
                    id={`${dataField.name}_${option.value}`}
                    name={dataField.name}
                    value={option.value}
                  />
                  <label htmlFor={`${dataField.name}_${option.value}`}>
                    {option.text}
                    <span className={dataField.required ? `text-red-700 text-lg` : `hidden`}> * </span>
                  </label>
                </div>
              ))}
            </div>
          </>
        );
      case 'input':
        return (
          <>
            <div className={dataField.hidden ? `hidden` : styles.input}>
              <label htmlFor={dataField.name}>
                {dataField.displayName}
                <span className={dataField.required ? `text-red-700 text-lg` : `hidden`}> * </span>
              </label>
              <input
                {...register(dataField.name)}
                type={dataField.hidden ? "hidden" : 'text' }
                id={dataField.name}
                name={dataField.name}
                // value={dataField.value}
                value={dataField.name == "event" ? event : dataField.value}

                required={dataField.required ? true : undefined }
              
              />
            </div>
          </>
        );
      case 'datetime':
        if(dataField.type == "dateTime") {
          return (
            <>
              <div className={dataField.hidden ? `hidden` : styles.input}>
                <label htmlFor={dataField.name}>
                  {dataField.displayName}
                  <span className={dataField.required ? `text-red-700 text-lg` : `hidden`}> * </span>
                </label>
                <input
                  {...register(dataField.name)}
                  type="datetime-local"
                  id={dataField.name}
                  name={dataField.name}
                  // value={dataField.value}
                  value={dataField.value}
  
                  required={dataField.required ? true : undefined }
                
                />
              </div>
            </>
          );
        } else {
          return (
            <>
              <div className={dataField.hidden ? `hidden` : styles.input}>
                <label htmlFor={dataField.name}>
                  {dataField.displayName}
                  <span className={dataField.required ? `text-red-700 text-lg` : `hidden`}> * </span>
                </label>
                <input
                  {...register(dataField.name)}
                  type={dataField.type}
                  id={dataField.name}
                  name={dataField.name}
                  // value={dataField.value}
                  value={dataField.value}
  
                  required={dataField.required ? true : undefined }
                
                />
              </div>
            </>
          );
        }
      default:
        return (
          <></>
        );
    }
  };

  return (
    <>
      {renderInput()}
    </>
  );
}

Input.propTypes = {
  dataField: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    interface: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  })).isRequired,
  register: PropTypes.string.isRequired,
};
