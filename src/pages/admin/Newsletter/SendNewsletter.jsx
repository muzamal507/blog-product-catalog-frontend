import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import newsletterService from '../../../services/newsletterService'

function SendNewsletter() {
  const navigate = useNavigate()

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSuccess('')
    setError('')

    const cleanSubject = subject.trim()
    const cleanMessage = message.trim()

    // Validation
    if (!cleanSubject) {
      setError('Please enter email subject.')
      return
    }

    if (!cleanMessage) {
      setError('Please enter your message.')
      return
    }
    setSending(true)

    try {
      const response = await newsletterService.sendNewsletter({
        subject: cleanSubject,
        message: cleanMessage,
      })

      setSuccess(response?.data?.message || 'Newsletter sent successfully.')
      setSubject('')
      setMessage('')

    } catch (err) {
      console.error('Newsletter send error:', err)

      setError(err?.response?.data?.message || 
        err?.response?.data?.error || 'Failed to send newsletter. Please try again.'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
        {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1">Send Newsletter</h4>
          <small className="text-muted">
            Send an email message to your subscribed users
          </small>
        </div>

        <button type="button" className="btn btn-outline-secondary"
          onClick={() => navigate('/admin/newsletter')}
        >
          ← Back to Subscribers
        </button>
      </div>

        {/*  Main Card */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm" style={{borderRadius: 12}} >
            <div className="card-body p-4">

              {/* Header */}
              <div className="mb-4">
                <h5 className="fw-bold mb-1">✉️ Compose Newsletter</h5>
                <p className="text-muted mb-0">
                  Write your message below. It will be sent to all
                  active subscribed users.
                </p>
              </div>

              {/* Success */}
              {success && (
                <div className="alert alert-success d-flex align-items-center gap-2" role="alert" >
                  <span>✅</span>
                  <div>{success}</div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert" >
                  <span>⚠️</span>
                  <div>{error}</div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Subject */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Email Subject
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input type="text" className="form-control" value={subject}
                    onChange={(e) =>setSubject(e.target.value)}
                    placeholder="Enter email subject..." maxLength={255} disabled={sending}
                  />
                  <div className="text-end mt-1">
                    <small className="text-muted">{subject.length}/255</small>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Message
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <textarea className="form-control" rows={12} value={message}
                    onChange={(e) =>setMessage(e.target.value)}
                    placeholder="Write your newsletter message here..."
                    disabled={sending} style={{resize: 'vertical', minHeight: 280}}
                  />

                  <small className="text-muted">
                    Write the message you want to send to your subscribers.
                  </small>
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light px-4" disabled={sending}
                    onClick={() => navigate('/admin/newsletter')}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn text-white px-4" disabled={sending}
                    style={{background: '#00b894', border: 'none', minWidth: 160}}
                  >
                    {sending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        ✉️ Send Newsletter
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>

          </div>

        </div>


        {/* ==================================================
            Information Card
        ================================================== */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm" style={{borderRadius: 12}} >
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">📧 Newsletter Information</h6>
              <div className="p-3 mb-3" style={{background: '#f0fdf9', borderRadius: 10,
                  border: '1px solid #d1fae5'}}
              >
                <div className="fw-semibold mb-1">
                  Who will receive this email?
                </div>
                <small className="text-muted">
                  The newsletter will be sent only to users
                  whose status is <strong>Subscribed</strong>.
                </small>
              </div>

              <div className="p-3 mb-3" style={{background: '#f8fafc', borderRadius: 10}} >
                <div className="fw-semibold mb-1">
                  📮 Email Delivery
                </div>
                <small className="text-muted">
                  Emails will be sent through your configured
                  Gmail SMTP account.
                </small>
              </div>

              <div className="p-3" style={{background: '#fff7ed', borderRadius: 10,
                  border: '1px solid #fed7aa'}} >
                <div className="fw-semibold mb-1">
                  ⚠️ Important
                </div>
                <small className="text-muted">
                  Make sure your Gmail SMTP configuration and
                  App Password are correctly configured in the
                  Laravel <code>.env</code> file.
                </small>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default SendNewsletter