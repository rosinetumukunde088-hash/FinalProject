import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FiFileText, FiUsers, FiPackage, FiActivity, FiCpu, FiDollarSign,
  FiPrinter, FiDownload, FiCheckSquare, FiSquare,
} from 'react-icons/fi';
import LineChart from '../../components/charts/LineChart';

const SECTION_DEFS = [
  { key: 'sales', label: 'Sales', icon: FiDollarSign },
  { key: 'users', label: 'Users', icon: FiUsers },
  { key: 'products', label: 'Products', icon: FiPackage },
  { key: 'behavior', label: 'Behavior & Engagement', icon: FiActivity },
  { key: 'adaptations', label: 'AI Adaptations', icon: FiCpu },
];

const DAY_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
];

function formatDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function toCsvValue(value) {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(toCsvValue).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function weekAgoStr() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return formatDateInput(d);
}

export default function AdminReports() {
  const { API } = useAuth();
  const [sections, setSections] = useState({ sales: true, users: true, products: true, behavior: true, adaptations: true });
  const [rangePreset, setRangePreset] = useState('7');
  const [fromDate, setFromDate] = useState(weekAgoStr());
  const [toDate, setToDate] = useState(formatDateInput(new Date()));
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [error, setError] = useState('');

  const isCustomRange = rangePreset === 'custom';

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const anySelected = Object.values(sections).some(Boolean);

  const resolveBehaviorRange = () => {
    if (!isCustomRange) {
      return { days: Number(rangePreset), label: `Last ${rangePreset} days` };
    }
    if (!fromDate || !toDate) {
      return { days: 7, label: 'Last 7 days' };
    }
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
    const label = `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
    return { days, label };
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const behaviorRange = resolveBehaviorRange();
      const requests = {};
      if (sections.sales) requests.sales = API.get('/reports/sales', { params: { days: behaviorRange.days } });
      if (sections.users) requests.users = API.get('/reports/users');
      if (sections.products) requests.products = API.get('/reports/products');
      if (sections.behavior) requests.behavior = API.get('/reports/behavior', { params: { days: behaviorRange.days } });
      if (sections.adaptations) requests.adaptations = API.get('/reports/adaptations');

      const keys = Object.keys(requests);
      const results = await Promise.all(keys.map((k) => requests[k]));

      const data = {};
      keys.forEach((k, i) => { data[k] = results[i].data; });
      if (sections.behavior || sections.sales) data.behaviorRangeLabel = behaviorRange.label;

      setReport(data);
      setGeneratedAt(new Date());
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCsv = () => {
    if (!report) return;
    const rows = [['Kiramart Rwanda - System Report'], [`Generated on ${generatedAt.toLocaleString()}`], []];

    if (report.sales) {
      rows.push([`SALES (${report.behaviorRangeLabel})`]);
      rows.push(['Total Revenue (RWF)', report.sales.totalRevenue]);
      rows.push(['Total Orders', report.sales.totalOrders]);
      rows.push(['Date', 'Revenue (RWF)']);
      report.sales.dailyTrend.forEach((d) => rows.push([d.date, d.total]));
      rows.push(['Top Product', 'Quantity Sold']);
      report.sales.topProducts.forEach((p) => rows.push([p.name, p.quantity]));
      rows.push(['Payment Method', 'Orders']);
      report.sales.byPaymentMethod.forEach((p) => rows.push([p.method, p.count]));
      rows.push([]);
    }

    if (report.users) {
      rows.push(['USERS']);
      rows.push(['Total Users', report.users.totalUsers]);
      rows.push(['Recent Registrations (7 days)', report.users.recentRegistrations]);
      rows.push(['Category', 'Count']);
      report.users.usersByCategory.forEach((u) => rows.push([u.category, u.count]));
      rows.push(['Role', 'Count']);
      report.users.usersByRole.forEach((u) => rows.push([u.role, u.count]));
      rows.push([]);
    }

    if (report.products) {
      rows.push(['PRODUCTS']);
      rows.push(['Total Products', report.products.totalProducts]);
      rows.push(['Price Range (min/avg/max)', report.products.priceRange.min, report.products.priceRange.avg, report.products.priceRange.max]);
      rows.push(['Category', 'Count', 'Avg Price']);
      report.products.productsByCategory.forEach((p) => rows.push([p.category, p.count, p.avgPrice]));
      rows.push([]);
    }

    if (report.behavior) {
      rows.push([`BEHAVIOR & ENGAGEMENT (${report.behaviorRangeLabel})`]);
      rows.push(['Total Events', report.behavior.totalEvents]);
      rows.push(['Avg Click Latency (ms)', report.behavior.avgMetrics.avgClickLatency]);
      rows.push(['Avg Wrong Clicks', report.behavior.avgMetrics.avgWrongClicks]);
      rows.push(['Avg Time Spent (s)', report.behavior.avgMetrics.avgTimeSpent]);
      rows.push(['Page', 'Views']);
      report.behavior.topPages.forEach((p) => rows.push([p.page, p.count]));
      rows.push([]);
    }

    if (report.adaptations) {
      rows.push(['AI ADAPTATIONS']);
      rows.push(['Total Adaptations', report.adaptations.totalAdaptations]);
      rows.push(['Category', 'Count']);
      report.adaptations.adaptationsByCategory.forEach((a) => rows.push([a.category, a.count]));
    }

    downloadCsv(`kiramart-report-${Date.now()}.csv`, rows);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate a full or customized report for the whole system</p>
      </div>

      <div className="admin-report-controls bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Customize Report</h2>

        <div className="flex flex-nowrap gap-3 mb-5 overflow-x-auto pb-1">
          {SECTION_DEFS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSection(key)}
              className={`flex-shrink-0 flex items-center justify-between space-x-3 px-4 py-3 rounded-xl border transition whitespace-nowrap ${
                sections[key]
                  ? 'border-purple-300 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <span className="flex items-center space-x-2">
                <Icon size={16} /><span className="font-medium text-sm">{label}</span>
              </span>
              {sections[key] ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
            </button>
          ))}
        </div>

        <div className="flex flex-nowrap items-end gap-4 overflow-x-auto pb-1">
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Report date range</label>
            <div className="admin-select-wrap">
              <select value={rangePreset} onChange={(e) => setRangePreset(e.target.value)} className="admin-select">
                {DAY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {isCustomRange && (
            <>
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  value={fromDate}
                  max={toDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  max={formatDateInput(new Date())}
                  onChange={(e) => setToDate(e.target.value)}
                  className="admin-input"
                />
              </div>
            </>
          )}

          <button
            onClick={handleGenerate}
            disabled={!anySelected || generating}
            className="flex-shrink-0 admin-btn admin-btn-primary"
          >
            <FiFileText size={16} />
            <span>{generating ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>

        {!anySelected && (
          <p className="text-xs text-red-500 mt-2">Select at least one section to include.</p>
        )}

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>

      {report && (
        <div className="printable-report bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kiramart Rwanda — System Report</h2>
              <p className="text-gray-500 text-sm mt-1">Generated on {generatedAt.toLocaleString()}</p>
            </div>
            <div className="flex space-x-3 admin-report-controls-inline">
              <button onClick={handleExportCsv} className="admin-btn admin-btn-outline">
                <FiDownload size={16} /><span>Export CSV</span>
              </button>
              <button onClick={() => window.print()} className="admin-btn admin-btn-primary">
                <FiPrinter size={16} /><span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {report.sales && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FiDollarSign className="text-blue-500" /><span>Sales ({report.behaviorRangeLabel})</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Revenue</p>
                    <p className="text-lg font-bold text-gray-900">{report.sales.totalRevenue.toLocaleString()} RWF</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Orders</p>
                    <p className="text-lg font-bold text-gray-900">{report.sales.totalOrders}</p>
                  </div>
                </div>
                {report.sales.dailyTrend.length > 0 ? (
                  <div className="mb-4">
                    <LineChart
                      data={report.sales.dailyTrend.map((d) => ({ label: d.date, value: d.total }))}
                      valueFormatter={(v) => `${v.toLocaleString()} RWF`}
                      labelFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-4">No sales in this range.</p>
                )}
                {report.sales.topProducts.length > 0 && (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500">
                        <th className="py-2 font-medium">Top Product</th>
                        <th className="py-2 font-medium">Qty Sold</th>
                        <th className="py-2 font-medium">Payment Method</th>
                        <th className="py-2 font-medium">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.sales.topProducts.slice(0, 5).map((p, i) => (
                        <tr key={p.name} className="border-b border-gray-50">
                          <td className="py-2">{p.name}</td>
                          <td className="py-2">{p.quantity}</td>
                          <td className="py-2 capitalize">{report.sales.byPaymentMethod[i]?.method ?? ''}</td>
                          <td className="py-2">{report.sales.byPaymentMethod[i]?.count ?? ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </section>
            )}

            {report.users && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FiUsers className="text-blue-500" /><span>Users</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Users</p>
                    <p className="text-lg font-bold text-gray-900">{report.users.totalUsers}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">New (7 days)</p>
                    <p className="text-lg font-bold text-gray-900">{report.users.recentRegistrations}</p>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-gray-500">
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium">Count</th>
                      <th className="py-2 font-medium">Role</th>
                      <th className="py-2 font-medium">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.users.usersByCategory.map((u, i) => (
                      <tr key={u.category} className="border-b border-gray-50">
                        <td className="py-2 capitalize">{u.category.toLowerCase()}</td>
                        <td className="py-2">{u.count}</td>
                        <td className="py-2">{report.users.usersByRole[i]?.role ?? ''}</td>
                        <td className="py-2">{report.users.usersByRole[i]?.count ?? ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {report.products && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FiPackage className="text-emerald-500" /><span>Products</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Products</p>
                    <p className="text-lg font-bold text-gray-900">{report.products.totalProducts}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Price Range</p>
                    <p className="text-lg font-bold text-gray-900">{report.products.priceRange.min} – {report.products.priceRange.max} RWF</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Avg Price</p>
                    <p className="text-lg font-bold text-gray-900">{report.products.priceRange.avg} RWF</p>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-gray-500">
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium">Count</th>
                      <th className="py-2 font-medium">Avg Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.products.productsByCategory.map((p) => (
                      <tr key={p.category} className="border-b border-gray-50">
                        <td className="py-2">{p.category}</td>
                        <td className="py-2">{p.count}</td>
                        <td className="py-2">{p.avgPrice} RWF</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {report.behavior && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FiActivity className="text-amber-500" /><span>Behavior & Engagement ({report.behaviorRangeLabel})</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Events</p>
                    <p className="text-lg font-bold text-gray-900">{report.behavior.totalEvents}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Avg Click Latency</p>
                    <p className="text-lg font-bold text-gray-900">{report.behavior.avgMetrics.avgClickLatency ?? 0}ms</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Avg Wrong Clicks</p>
                    <p className="text-lg font-bold text-gray-900">{report.behavior.avgMetrics.avgWrongClicks ?? 0}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Avg Time Spent</p>
                    <p className="text-lg font-bold text-gray-900">{report.behavior.avgMetrics.avgTimeSpent ?? 0}s</p>
                  </div>
                </div>
                {report.behavior.topPages.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500">
                        <th className="py-2 font-medium">Page</th>
                        <th className="py-2 font-medium">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.behavior.topPages.map((p) => (
                        <tr key={p.page} className="border-b border-gray-50">
                          <td className="py-2">{p.page}</td>
                          <td className="py-2">{p.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm">No behavior data in this range.</p>
                )}
              </section>
            )}

            {report.adaptations && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <FiCpu className="text-purple-500" /><span>AI Adaptations</span>
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 inline-block mb-4">
                  <p className="text-xs text-gray-500">Total Adaptations</p>
                  <p className="text-lg font-bold text-gray-900">{report.adaptations.totalAdaptations}</p>
                </div>
                {report.adaptations.adaptationsByCategory.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500">
                        <th className="py-2 font-medium">User Category</th>
                        <th className="py-2 font-medium">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.adaptations.adaptationsByCategory.map((a) => (
                        <tr key={a.category} className="border-b border-gray-50">
                          <td className="py-2 capitalize">{a.category.toLowerCase()}</td>
                          <td className="py-2">{a.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm">No adaptation data available.</p>
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
