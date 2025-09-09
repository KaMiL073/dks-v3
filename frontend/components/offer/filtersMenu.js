/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

export default function FiltersMenu({ filters, handleFiltersSet }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    handleFiltersSet(data);
  };

  const onReset = () => {
    reset();
    handleFiltersSet(false);
  };

  const filtersElements = filters.map((filter) => (
    <div className="border-b border-black mx-4 py-4" key={filter.name}>
      <p className="font-bold mb-2">{filter.displayName}</p>
      {filter.options.map((option) => (
        <div key={option.value}>
          <input
            {...register(filter.name)}
            type="radio"
            id={`${filter.name}_${option.value}`}
            name={filter.name}
            value={option.value}
          />
          <label className="ml-2 text-sm text-dks-font" htmlFor={`${filter.name}_${option.value}`}>
            {option.text}
          </label>
        </div>
      ))}
    </div>
  ));

  return (
    <div className="bg-dks-light-gray pb-1">
      <div className="text-center text-white bg-dks-red py-2 text-sm">
        FILTRUJ LISTĘ
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {filtersElements}
        <div className="flex my-4 mx-3">
          <button
            onClick={onReset}
            type="button"
            className="rounded border-2 border-black p-1 text-sm font-bold w-49 mr-1"
          >
            RESETUJ
          </button>
          <button
            type="submit"
            className="rounded bg-dks-red text-white p-1 text-sm font-bold w-49"
          >
            FILTRUJ
          </button>
        </div>
      </form>
    </div>
  );
}

FiltersMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    interface: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  })).isRequired,
  handleFiltersSet: PropTypes.func.isRequired,
};
