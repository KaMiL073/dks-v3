import backend from '../api/directus';

export default async function saveFormData(formData) {
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      if (formData[key] instanceof Date) {
        const date = new Date(formData[key]).toISOString();

        formData[key] = date || null;

        const [time_from_hours, time_from_minutes] = formData.time_from.split(":");
        const [time_to_hours, time_to_minutes] = formData.time_to.split(":");

        const startDate = new Date(formData[key]);
        startDate.setHours(time_from_hours);
        startDate.setMinutes(time_from_minutes);
        formData.start_date = startDate.toISOString();

        const endDate = new Date(formData[key]);
        endDate.setHours(time_to_hours);
        endDate.setMinutes(time_to_minutes);
        formData.end_date = endDate.toISOString();
      }
    }
  }
  
  formData.date_updated = null;
  formData.date_created = null;
  
  return backend.post(`/items/presentations`, formData).then(() => true);
}
