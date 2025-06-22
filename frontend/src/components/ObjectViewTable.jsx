export default function ObjectViewTable({ data, columns }) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div className="object-view-table">No data available</div>;
    }

    return (
        <table className="object-view-table">
            <thead>
                <tr>
                    {columns.map((col, index) => (
                        <th key={index}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map(obj => (
                    // possibly later create a component for each row
                    // to handle complex objects or nested structures
                    <tr key={obj.id || JSON.stringify(obj)}>
                        {columns.map(col => (
                            <td key={col.key}>{obj[col.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}