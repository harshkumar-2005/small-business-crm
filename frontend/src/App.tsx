import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'

type Lead = {
	id: string
	name: string
	email: string
	phoneNumber: string
	companyName: string
	status: LeadStatus
	notes?: string | null
	createdAt: string
	updatedAt?: string
}

type LeadResponse = {
	success: boolean
	data: Lead[]
	pagination: {
		page: number
		limit: number
		totalItems: number
		totalPages: number
		hasNextPage: boolean
		hasPreviousPage: boolean
	}
}

type ApiMessage = {
	success: boolean
	message?: string
}

type LeadFormState = {
	name: string
	email: string
	phoneNumber: string
	companyName: string
	status: LeadStatus
	notes: string
}

const API_BASE = '/v1/api/backend/customer'
const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost']

const emptyForm = (): LeadFormState => ({
	name: '',
	email: '',
	phoneNumber: '',
	companyName: '',
	status: 'New',
	notes: '',
})

const statusOrder: Record<LeadStatus, number> = {
	New: 0,
	Contacted: 1,
	Qualified: 2,
	Converted: 3,
	Lost: 4,
}

const formatDate = (value: string) =>
	new Intl.DateTimeFormat('en', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	}).format(new Date(value))

function App() {
	const [leads, setLeads] = useState<Lead[]>([])
	const [page, setPage] = useState(1)
	const [limit] = useState(8)
	const [totalPages, setTotalPages] = useState(1)
	const [totalItems, setTotalItems] = useState(0)
	const [searchInput, setSearchInput] = useState('')
	const [search, setSearch] = useState('')
	const [statusFilter, setStatusFilter] = useState<'All' | LeadStatus>('All')
	const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'status'>('newest')
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
	const [activeLead, setActiveLead] = useState<Lead | null>(null)
	const [form, setForm] = useState<LeadFormState>(emptyForm())

	const loadLeads = async (nextPage = page, nextSearch = search) => {
		setLoading(true)
		setError(null)

		try {
			const params = new URLSearchParams({
				page: String(nextPage),
				limit: String(limit),
			})

			if (nextSearch.trim()) {
				params.set('search', nextSearch.trim())
			}

			const response = await fetch(`${API_BASE}/all-lead?${params.toString()}`)
			if (!response.ok) {
				throw new Error('Failed to load leads')
			}

			const payload = (await response.json()) as LeadResponse
			setLeads(payload.data ?? [])
			setPage(payload.pagination.page)
			setTotalPages(payload.pagination.totalPages)
			setTotalItems(payload.pagination.totalItems)
		} catch (fetchError) {
			setError(fetchError instanceof Error ? fetchError.message : 'Unable to fetch leads')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		queueMicrotask(() => {
			void loadLeads(1, search)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search])

	const visibleLeads = useMemo(() => {
		const filtered = statusFilter === 'All' ? leads : leads.filter((lead) => lead.status === statusFilter)

		return [...filtered].sort((left, right) => {
			if (sortBy === 'name') {
				return left.name.localeCompare(right.name)
			}

			if (sortBy === 'status') {
				return statusOrder[left.status] - statusOrder[right.status]
			}

			const leftDate = new Date(left.createdAt).getTime()
			const rightDate = new Date(right.createdAt).getTime()
			return sortBy === 'oldest' ? leftDate - rightDate : rightDate - leftDate
		})
	}, [leads, sortBy, statusFilter])

	const stats = useMemo(() => {
		return LEAD_STATUSES.reduce(
			(accumulator, currentStatus) => {
				accumulator[currentStatus] = leads.filter((lead) => lead.status === currentStatus).length
				return accumulator
			},
			{} as Record<LeadStatus, number>,
		)
	}, [leads])

	const openCreateModal = () => {
		setActiveLead(null)
		setForm(emptyForm())
		setModalMode('create')
	}

	const openEditModal = (lead: Lead) => {
		setActiveLead(lead)
		setForm({
			name: lead.name,
			email: lead.email,
			phoneNumber: lead.phoneNumber,
			companyName: lead.companyName,
			status: lead.status,
			notes: lead.notes ?? '',
		})
		setModalMode('edit')
	}

	const closeModal = () => {
		if (saving) {
			return
		}

		setModalMode(null)
		setActiveLead(null)
		setForm(emptyForm())
	}

	const submitLead = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSaving(true)
		setError(null)
		setSuccessMessage(null)

		try {
			if (modalMode === 'create') {
				const response = await fetch(`${API_BASE}/create-lead`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(form),
				})

				if (!response.ok) {
					const failure = (await response.json().catch(() => null)) as ApiMessage | null
					throw new Error(failure?.message ?? 'Failed to create lead')
				}

				setSuccessMessage('Lead created successfully')
			}

			if (modalMode === 'edit' && activeLead) {
				const [statusResponse, notesResponse] = await Promise.all([
					fetch(`${API_BASE}/update-lead/status/${activeLead.id}`, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ status: form.status }),
					}),
					fetch(`${API_BASE}/update-lead/details/${activeLead.id}`, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ notes: form.notes || null }),
					}),
				])

				if (!statusResponse.ok) {
					const failure = (await statusResponse.json().catch(() => null)) as ApiMessage | null
					throw new Error(failure?.message ?? 'Failed to update lead status')
				}

				if (!notesResponse.ok) {
					const failure = (await notesResponse.json().catch(() => null)) as ApiMessage | null
					throw new Error(failure?.message ?? 'Failed to update lead notes')
				}

				setSuccessMessage('Lead updated successfully')
			}

			closeModal()
			await loadLeads(page, search)
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Failed to save lead')
		} finally {
			setSaving(false)
		}
	}

	const updateStatus = async (leadId: string, status: LeadStatus) => {
		setError(null)
		setSuccessMessage(null)

		try {
			const response = await fetch(`${API_BASE}/update-lead/status/${leadId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			})

			if (!response.ok) {
				const failure = (await response.json().catch(() => null)) as ApiMessage | null
				throw new Error(failure?.message ?? 'Failed to update lead status')
			}

			setSuccessMessage('Lead status updated')
			await loadLeads(page, search)
		} catch (statusError) {
			setError(statusError instanceof Error ? statusError.message : 'Failed to update lead status')
		}
	}

	const deleteLead = async (leadId: string) => {
		const shouldDelete = window.confirm('Delete this lead? This action cannot be undone.')
		if (!shouldDelete) {
			return
		}

		setError(null)
		setSuccessMessage(null)

		try {
			const response = await fetch(`${API_BASE}/delete-lead/${leadId}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				const failure = (await response.json().catch(() => null)) as ApiMessage | null
				throw new Error(failure?.message ?? 'Failed to delete lead')
			}

			setSuccessMessage('Lead deleted successfully')
			await loadLeads(page, search)
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete lead')
		}
	}

	const submitSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSearch(searchInput)
		void loadLeads(1, searchInput)
	}

	const resetFilters = () => {
		setSearchInput('')
		setSearch('')
		setStatusFilter('All')
		setSortBy('newest')
		void loadLeads(1, '')
	}

	return (
		<main className="app-shell">
			<section className="hero-card">
				<div>
					<p className="eyebrow">Small Business CRM</p>
					<h1>Lead management that feels fast, clear, and operational.</h1>
					<p className="hero-copy">
						Track prospects from first contact to conversion with a dashboard built around the current backend API.
					</p>
				</div>

				<div className="hero-actions">
					<button type="button" className="primary-button" onClick={openCreateModal}>
						Add Lead
					</button>
					<div className="hero-badge">
						<strong>{totalItems}</strong>
						<span>Total leads</span>
					</div>
				</div>
			</section>

			<section className="stats-grid">
				<article className="stat-card accent">
					<span>Open pipeline</span>
					<strong>{stats.New + stats.Contacted + stats.Qualified}</strong>
					<small>New, contacted, and qualified leads</small>
				</article>
				<article className="stat-card">
					<span>Converted</span>
					<strong>{stats.Converted}</strong>
					<small>Closed won opportunities</small>
				</article>
				<article className="stat-card">
					<span>Lost</span>
					<strong>{stats.Lost}</strong>
					<small>Leads marked as not pursuing</small>
				</article>
				<article className="stat-card">
					<span>Active leads</span>
					<strong>{leads.length}</strong>
					<small>Visible on the current page</small>
				</article>
			</section>

			<section className="toolbar-card">
				<form className="search-form" onSubmit={submitSearch}>
					<input
						type="search"
						placeholder="Search by name, email, or company"
						value={searchInput}
						onChange={(event) => setSearchInput(event.target.value)}
					/>
					<button type="submit" className="secondary-button">
						Search
					</button>
				</form>

				<div className="filter-row">
					<label>
						Status
						<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'All' | LeadStatus)}>
							<option value="All">All</option>
							{LEAD_STATUSES.map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</label>

					<label>
						Sort
						<select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
							<option value="newest">Newest first</option>
							<option value="oldest">Oldest first</option>
							<option value="name">Name</option>
							<option value="status">Status</option>
						</select>
					</label>

					<button type="button" className="ghost-button" onClick={resetFilters}>
						Reset
					</button>
				</div>
			</section>

			{(error || successMessage) && (
				<section className={`message-banner ${error ? 'error' : 'success'}`}>
					{error ?? successMessage}
				</section>
			)}

			<section className="table-card">
				<div className="table-header">
					<div>
						<h2>Leads dashboard</h2>
						<p>
							Showing {visibleLeads.length} leads on this page · {totalPages} page{totalPages === 1 ? '' : 's'}
						</p>
					</div>
					<button type="button" className="primary-button mobile-wide" onClick={openCreateModal}>
						New Lead
					</button>
				</div>

				{loading ? (
					<div className="empty-state">Loading leads...</div>
				) : visibleLeads.length === 0 ? (
					<div className="empty-state">
						<strong>No leads found.</strong>
						<span>Try a different search or add a new prospect.</span>
					</div>
				) : (
					<div className="lead-list">
						{visibleLeads.map((lead) => (
							<article key={lead.id} className="lead-row">
								<div className="lead-main">
									<div className="lead-title-row">
										<div>
											<h3>{lead.name}</h3>
											<p>{lead.companyName}</p>
										</div>
										<span className={`status-pill ${lead.status.toLowerCase()}`}>{lead.status}</span>
									</div>

									<div className="lead-meta">
										<span>{lead.email}</span>
										<span>{lead.phoneNumber}</span>
										<span>Created {formatDate(lead.createdAt)}</span>
									</div>

									<p className="lead-notes">{lead.notes?.trim() ? lead.notes : 'No notes added yet.'}</p>
								</div>

								<div className="lead-actions">
									<label>
										Status
										<select value={lead.status} onChange={(event) => void updateStatus(lead.id, event.target.value as LeadStatus)}>
											{LEAD_STATUSES.map((status) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</select>
									</label>

									<button type="button" className="secondary-button" onClick={() => openEditModal(lead)}>
										Edit
									</button>
									<button type="button" className="danger-button" onClick={() => void deleteLead(lead.id)}>
										Delete
									</button>
								</div>
							</article>
						))}
					</div>
				)}

				<div className="pagination-row">
					<button type="button" className="ghost-button" disabled={page <= 1 || loading} onClick={() => void loadLeads(page - 1, search)}>
						Previous
					</button>
					<span>
						Page {page} of {totalPages}
					</span>
					<button
						type="button"
						className="ghost-button"
						disabled={page >= totalPages || loading}
						onClick={() => void loadLeads(page + 1, search)}
					>
						Next
					</button>
				</div>
			</section>

			{modalMode && (
				<div className="modal-backdrop" role="presentation" onClick={closeModal}>
					<section className="modal-card" role="dialog" aria-modal="true" aria-label={modalMode === 'create' ? 'Add lead' : 'Edit lead'} onClick={(event) => event.stopPropagation()}>
						<div className="modal-header">
							<div>
								<p className="eyebrow">{modalMode === 'create' ? 'Create lead' : 'Edit lead'}</p>
								<h2>{modalMode === 'create' ? 'Add a new lead' : 'Update lead details'}</h2>
							</div>
							<button type="button" className="icon-button" onClick={closeModal} aria-label="Close dialog">
								×
							</button>
						</div>

						<form className="lead-form" onSubmit={submitLead}>
							<label>
								Name
								<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
							</label>
							<label>
								Email
								<input
									required
									type="email"
									value={form.email}
									onChange={(event) => setForm({ ...form, email: event.target.value })}
								/>
							</label>
							<label>
								Phone Number
								<input
									required
									value={form.phoneNumber}
									onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
								/>
							</label>
							<label>
								Company Name
								<input
									required
									value={form.companyName}
									onChange={(event) => setForm({ ...form, companyName: event.target.value })}
								/>
							</label>
							<label>
								Lead Status
								<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as LeadStatus })}>
									{LEAD_STATUSES.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</label>
							<label className="full-span">
								Notes
								<textarea
									rows={4}
									value={form.notes}
									onChange={(event) => setForm({ ...form, notes: event.target.value })}
									placeholder="Add context, objections, next steps, or reminders"
								/>
							</label>

							{modalMode === 'edit' && (
								<p className="helper-text full-span">
									The current backend persists status and notes updates; the full contact details are collected on create.
								</p>
							)}

							<div className="modal-actions full-span">
								<button type="button" className="ghost-button" onClick={closeModal}>
									Cancel
								</button>
								<button type="submit" className="primary-button" disabled={saving}>
									{saving ? 'Saving...' : modalMode === 'create' ? 'Create Lead' : 'Save Changes'}
								</button>
							</div>
						</form>
					</section>
				</div>
			)}
		</main>
	)
}

export default App
