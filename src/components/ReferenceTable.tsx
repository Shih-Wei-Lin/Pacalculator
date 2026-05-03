import React from 'react';
import { VDOT_DATA } from '../data/vdotTable';

export const ReferenceTable: React.FC = () => {
  return (
    <div className="reference-table-container">
      <h3>Table 5.1: VDOT and Race Performances</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>VDOT</th>
              <th>1500m</th>
              <th>1 Mile</th>
              <th>3000m</th>
              <th>2 Miles</th>
              <th>5K</th>
              <th>10K</th>
              <th>15K</th>
              <th>Half</th>
              <th>Full</th>
            </tr>
          </thead>
          <tbody>
            {VDOT_DATA.map((row) => (
              <tr key={row.vdot}>
                <td><strong>{row.vdot}</strong></td>
                <td>{row["1500"]}</td>
                <td>{row["1mile"]}</td>
                <td>{row["3000"]}</td>
                <td>{row["2mile"]}</td>
                <td>{row["5k"]}</td>
                <td>{row["10k"]}</td>
                <td>{row["15k"]}</td>
                <td>{row["half"]}</td>
                <td>{row["full"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
