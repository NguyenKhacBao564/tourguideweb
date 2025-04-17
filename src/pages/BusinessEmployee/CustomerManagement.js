import React, { useState } from 'react';
import DataTable from '../../components/DataTable/DataTable';

function CustomerManagement(props) {
    const [statusFilter, setStatusFilter] = useState("all");
    return (
        <div>
            <DataTable filterStatus={statusFilter}/>
        </div>
    );
}

export default CustomerManagement;