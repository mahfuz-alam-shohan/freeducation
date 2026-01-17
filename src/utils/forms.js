export function valueFromForm(form, name) {
  return (form.get(name) || "").toString().trim();
}
