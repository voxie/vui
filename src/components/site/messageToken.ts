// The message the token examples share. Everything in it is made up.
export const message =
	'Hi {{contact→first_name ?? contact→last_name ?? "there"}}! Thanks for asking about {{team→team_name}} {{group→group_name}}. Want to tour our {{local→program_interest ?? "preschool"}} classroom? Book here: {{group→custom_attributes→booking_link ?? exit}}';
