// The message the token examples share. Everything in it is made up.
export const message =
	'Hi {{contact=>first_name ?? contact=>last_name ?? "there"}}! Thanks for asking about {{team=>name}} {{group=>name}}. Want to tour our {{contact=>local=>custom_attributes=>program_interest ?? "preschool"}} classroom? Book here: {{group=>custom_attributes=>booking_link ?? exit}}';
