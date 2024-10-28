// Add Black Friday section to the form
<div className="space-y-4">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
    Black Friday Settings
  </h3>

  <div className="space-y-2">
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={formData.is_black_friday}
        onChange={e => setFormData(prev => ({
          ...prev,
          is_black_friday: e.target.checked
        }))}
        className="rounded border-gray-300"
        disabled={isSubmitting}
      />
      <span>Black Friday Deal</span>
    </label>

    {formData.is_black_friday && (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Black Friday Price
        </label>
        <input
          type="number"
          value={formData.black_friday_price || ''}
          onChange={e => setFormData(prev => ({
            ...prev,
            black_friday_price: e.target.value ? parseFloat(e.target.value) : undefined
          }))}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          min="0"
          step="0.01"
          placeholder="Leave empty to use regular price with discount"
          disabled={isSubmitting}
        />
      </div>
    )}

    {formData.is_black_friday && (
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Discount Percentage
        </label>
        <input
          type="number"
          value={formData.discount || 0}
          onChange={e => setFormData(prev => ({
            ...prev,
            discount: parseInt(e.target.value)
          }))}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          min="0"
          max="100"
          disabled={isSubmitting}
        />
      </div>
    )}
  </div>
</div>