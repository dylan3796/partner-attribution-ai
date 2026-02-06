"use client";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-sm text-gray-500 mt-1">Configure your partner platform</p></div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Organization</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label><input type="text" defaultValue="Acme Inc" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" defaultValue="admin@acme.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Default Attribution Model</h3>
          <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>Equal Split</option><option>First Touch</option><option>Last Touch</option><option>Time Decay</option><option selected>Role-Based</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">This model will be used by default for new deal attributions</p>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">API Key</h3>
          <div className="flex items-center gap-3">
            <input type="text" value="pk_live_abc123def456..." readOnly className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-500 font-mono" />
            <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Copy</button>
            <button className="px-4 py-2.5 rounded-xl border border-red-200 text-sm text-red-600 hover:bg-red-50 transition">Regenerate</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Use this key to authenticate API requests</p>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Commission Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Default Rate (%)</label><input type="number" defaultValue="10" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Payout Frequency</label>
              <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Monthly</option><option>Quarterly</option><option>On demand</option>
              </select>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
