import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { read, utils } from 'xlsx'
import readXlsxFile from 'read-excel-file'
import axios from 'axios'
import config from '../../../config.json';
import { UserContext } from '../../common/UserContext';
import { toastify } from '../../common/notification'
import moment from 'moment'
import '../dashboard.css'
import ReactPaginate from 'react-paginate'
import Loader from '../../common/Loader'
type Props = {}

const url = config['baseHost_backend'];
function Report({ setUser }: { setUser: Function }) {
    const [filter, setFilter] = useState<any>('All')
    const [data, setData] = useState<any>(null)
    const { authToken, fromDate, toDate, type, ID } = useContext(UserContext);
    let fileUpload = useRef<any>(null)
    const [front, setFront] = useState(0)
    const [back, setBack] = useState(0)
    const [total, seTtotal] = useState(0)
    const [ROI, setROI] = useState(0)
    const [pageNumber, setPageNumber] = useState(0);
    const [rowPerPage, setRowperPage] = useState(10);
    const [displayData, setDisplayData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const pageVisited = pageNumber * rowPerPage;
    const handleBtn = () => {
        fileUpload.current.click()
    }

    const handleFileChange = (event: any) => {
        console.log("event", event.target.files[0]);
        var reader = new FileReader();
        reader.readAsArrayBuffer(event.target.files[0]);
        reader.onload = (event: any) => {
            setLoading(true)
            console.log("binary", event.target.result)
            const data = event.target.result;
            const workBook = read(data, { type: "binary" });
            console.log("workbook", workBook)
            workBook.SheetNames.forEach((sheet) => {
                const rowObject = utils.sheet_to_json(workBook.Sheets[sheet])
                console.log('rowObject', rowObject);
                //axios call
                let bodyData = rowObject;

                let userInfo = {
                    data: {
                        actionType:'dashboardFetch',
                        type: type,
                        ID: type==='corporate' ? ID : Number(ID),
                        bodyData: bodyData
                    }
                }

                axios
                    .post(`${url}/drm-dashboard`, userInfo, {
                        headers: {
                            authorization: `Bearer ${authToken}`,
                        },
                    })
                    .then((res) => {
                        setData(res.data.body.updateArray);
                        setFront(res.data.body.sum.totalFront)
                        setBack(res.data.body.sum.totalBack)
                        seTtotal(res.data.body.sum.total)
                        setROI(res.data.body.sum.totalSalesPrice)
                        setUser((prev: any) => ({ ...prev, soldvalue: res.data?.body?.updateArray.length }))
                        console.log('Post responce', res)
                        setLoading(false)
                    })
                    .catch((error) => {
                        setLoading(false)
                        toastify(
                            'failure',
                            error.response.data.message.length > 0
                                ? error.response.data.message
                                : 'Something went wrong'
                        )
                    }
                    );
            })
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }


    useEffect(() => {
        let tempArray = [] as any;
        if (data) {
            if (filter === 'All') {
                data?.slice(pageVisited, pageVisited + rowPerPage)
                    .map((obj: any) => {
                        tempArray.push({
                            name: obj["Name"],
                            vehicle: obj["Vehicle "],
                            dateSold: obj["Sold Date"],
                            mesgDate: !obj["Message Date"] ? 'N/A' : moment(obj["Message Date"]).format('LL'),
                            front: obj["Front"],
                            back: obj["Back"],
                            total: obj["Total "],
                            salePrice: obj["Sale Price"]
                        })
                    })
                setDisplayData(tempArray);
                console.log('excel', tempArray)

            }
            else {
                // data?.carModel.filter((car: any) => car._id === filter)
                //     .sort((a: any, b: any) =>
                //         (a.count > b.count) ? -1 : 1)
                //     .slice(pageVisited, pageVisited + rowPerPage)
                //     .map((car: any) => {
                //         tempArray.push({
                //             _id: car._id,
                //             percent: car.percent,
                //             count: car.count
                //         })
                //     })Res
                // setDisplayData(tempArray);
            }
        }
    }, [data, filter, pageNumber])

    let pageCount = filter === 'All' ? Math.ceil(data?.length / rowPerPage) : Math.ceil(displayData?.length / rowPerPage)

    const handlePageClick = (Selected: any) => {
        console.log('selected', Selected.selected)
        setPageNumber(Selected.selected)

    }

    useEffect(() => {
        console.log('from date to date', fromDate, toDate)
    }, [fromDate, toDate])

    const getFromDate = () => {
        let date = new Date(fromDate)
        return ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()
    }

    const getToDate = () => {
        let date = new Date(toDate)
        return ("0" + date.getDate()).slice(-2) + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear()
    }

    return (
        <>
            <Row className="container row w-100">
                {loading ? <Loader /> :
                    (<Col className='spacing-1'>
                        <div className="d-flex justify-content-between p-3">
                            <div>
                                <h2 className='font-weight-bold p-0 m-0'>ROI Matchback Report</h2>
                            </div>
                            <div className='d-flex flex-column align-items-end'>
                                <input type="file" onChange={handleFileChange} hidden ref={fileUpload} name="excel" id="excel" accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' />

                                <Button className={fromDate && toDate ? 'btn btn-success btn-sm w-25' : 'btn btn-success btn-sm w-100'} onClick={handleBtn}>Choose File</Button>
                                {fromDate && toDate && <span className='message-for-upload text-danger'>*Please select the file with date between {getFromDate()} & {getToDate()}</span>}
                            </div>
                        </div>
                        {data && <><div className="d-flex justify-content-between pb-2">
                            <div className='d-flex flex-column'>
                                <span className='text-center'>Front</span>
                                <h2>${front}</h2>
                            </div>
                            <div className='d-flex flex-column'>
                                <span className='text-center'>Back</span>
                                <h2>${back}</h2>
                            </div>
                            <div className='d-flex flex-column'>
                                <span className='text-center'>Total</span>
                                <h2>${total}</h2>
                            </div>
                            <div className='d-flex flex-column'>
                                <span className='text-center'>ROI</span>
                                <h2>{ROI}%</h2>
                            </div>
                        </div>
                            <table className="table">
                                <thead className="thead-dark bg-dark text-white">
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Vehicle</th>
                                        <th scope="col">Date Sold</th>
                                        <th scope="col">Mesg Date</th>
                                        <th scope="col">Front</th>
                                        <th scope="col">Back</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">Sale price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !displayData || displayData?.length < 1 ?
                                            <div><h3 className='py-3'>No Data Found</h3></div>
                                            :
                                            displayData?.map((data: any, index: any) => (
                                                <>
                                                    <tr>
                                                        <td>{data.name}</td>
                                                        <td>{data.vehicle}</td>
                                                        <td>{data.dateSold}</td>
                                                        <td>{data.mesgDate}</td>
                                                        <td>{data.front}</td>
                                                        <td>{data.back}</td>
                                                        <td>{data.total}</td>
                                                        <td>{data.salePrice}</td>
                                                    </tr>
                                                </>
                                            ))
                                    }
                                </tbody>
                            </table>
                            {!displayData || displayData?.length < 1 && 
                                <ReactPaginate
                                    nextLabel=">>"
                                    onPageChange={handlePageClick}
                                    pageCount={pageCount}
                                    previousLabel="<<"
                                    containerClassName='pagination'
                                    pageClassName={filter === 'All' ? 'pagination' : 'page-item disabled'}
                                    // pageClassName='page-item'
                                    pageLinkClassName='page-link'
                                    previousClassName='page-item'
                                    previousLinkClassName='page-link'
                                    nextClassName='page-item'
                                    nextLinkClassName='page-link'
                                    breakLabel='...'
                                    breakLinkClassName='page-link'
                                    activeClassName='active'
                                    breakClassName='page-item'
                                />
                            }
                        </>}
                    </Col>)}
            </Row>



        </>
    )
}

export default Report