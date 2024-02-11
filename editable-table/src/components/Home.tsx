import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { defaultData } from "../data";
import { columns } from "./columns";
import { Student } from "../types/Student";
import FooterCell from "./FooterCell";

const Home = () => {
    const [data, setData] = useState(() => [...defaultData]);
    const [originalData, setOriginalData] = useState(() => [...defaultData]);
    const [editedRows, setEditedRows] = useState({});
    const [validRows, setValidRows] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        meta: {
            editedRows,
            setEditedRows,
            validRows,
            setValidRows,
            revertData: (rowIndex: number, revert: boolean) => {
                if (revert) {
                    setData((old) =>
                        old.map((row, index) =>
                            index === rowIndex ? originalData[rowIndex] : row
                        )
                    );
                } else {
                    setOriginalData((old) =>
                        old.map((row, index) =>
                            index === rowIndex ? data[rowIndex] : row
                        )
                    );
                }
            },
            updateData: (
                rowIndex: number,
                columnId: string,
                value: string,
                isValid: boolean
            ) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex],
                                [columnId]: value,
                            };
                        }

                        return row;
                    })
                );

                setValidRows((old: any) => ({
                    ...old,
                    [rowIndex]: { ...old[rowIndex], [columnId]: isValid },
                }));
            },
            addRow: () => {
                const newRow: Student = {
                    studentId: Math.floor(Math.random() * 10000),
                    name: "",
                    dateOfBirth: "",
                    major: "",
                };

                const setFunc = (old: Student[]) => [...old, newRow];
                setData(setFunc);
                setOriginalData(setFunc);
            },
            removeRow: (rowIndex: number) => {
                const setFilterFunc = (old: Student[]) =>
                    old.filter(
                        (_row: Student, index: number) => index !== rowIndex
                    );

                setData(setFilterFunc);
                setOriginalData(setFilterFunc);
            },
            removeSelectedRows: (selectedRows: number[]) => {
                const setFilterFunc = (old: Student[]) =>
                    old.filter(
                        (_row: Student, index) => !selectedRows.includes(index)
                    );

                setData(setFilterFunc);
                setOriginalData(setFilterFunc);
            },
        },
    });

    return (
        <>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <th
                            colSpan={table.getCenterLeafColumns().length}
                            align="right"
                        >
                            <FooterCell table={table} />
                        </th>
                    </tr>
                </tfoot>
            </table>
            <pre>{JSON.stringify(data, null, "\t")}</pre>
        </>
    );
};

export default Home;
