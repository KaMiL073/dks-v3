export default function getTextField(identifier, textFields) {
  return textFields?.find((field) => field.identifier === identifier)?.content || '';
}
