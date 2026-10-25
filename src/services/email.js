// Sends a parent report. There's no backend yet, so this opens the teacher's
// own email app with the report filled in (they press Send there).
//
// To send automatically every week, replace this with a call to a backend
// endpoint that uses an email provider (e.g. Resend, SendGrid, Amazon SES)
// and runs on a weekly schedule.
export function sendReportEmail({ to, subject, body }) {
  const params = new URLSearchParams({ subject, body })
  // URLSearchParams encodes spaces as "+", which mail apps show literally.
  const query = params.toString().replace(/\+/g, '%20')
  window.location.href = `mailto:${to.join(',')}?${query}`
}
