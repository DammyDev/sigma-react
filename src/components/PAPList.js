import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProductService } from '../service/ProductService';
import { CustomerService } from '../service/CustomerService';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import moment from 'moment'
import firebase, {auth, generateUserDocument, firestore, } from '../FirebaseConfig';
import 'firebase/storage';
import {
    Document,
    Table, TableRow, TableCell,
    WidthType,
    HorizontalPositionAlign,
    HorizontalPositionRelativeFrom,
    Media,
    Packer,
    Paragraph,
    VerticalPositionAlign,
    VerticalPositionRelativeFrom
  } from "docx";
  
  import { saveAs } from "file-saver";
  
  let imgBlobArray = [];
  const doc = new Document();

export const PAPList = () => {

    const [loader, setLoader] = useState(false);
    const [imageReady, setImageReady] = useState(false);
    const [downloadAgain, setDownloadAgain] = useState(false);
    const [pap, setPAP] = useState([]);
    const [customer1, setCustomer1] = useState(null);
    const [customer2, setCustomer2] = useState(null);
    const [customer3, setCustomer3] = useState(null);
    const [selectedCustomers1, setSelectedCustomers1] = useState(null);
    const [selectedCustomers2, setSelectedCustomers2] = useState(null);
    const [globalFilter1, setGlobalFilter1] = useState('');
    const [globalFilter2, setGlobalFilter2] = useState('');
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [products, setProducts] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);
    const [randomStr, setRandomStr] = useState('')

    useEffect(() => {
       setPAP([]);

       firestore.collection("surveys").get().then((querySnapshot) => {   
            querySnapshot.forEach((doc) => {
                setPAP(e => [...e, doc.data()])
            });

            setLoading1(false)
        });

    }, []);

    useEffect(() => {

       if (dt?.current?.props?.value?.length === randomStr) setImageReady(true)
    
       imageReady && imgBlobArray.length && (() =>{ 

        const table = new Table({
                rows: getRows()
        });

        doc.addSection({
            children: [new Paragraph("PAP Report"),  table]
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, "example.docx");
            console.log("Document created successfully");
            setLoader(false);
        });     
    })()

    }, [dt?.current?.props?.value?.length, randomStr, imageReady]);

    const getRows = () => {
        let dtTableRows =[
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph(" S/N")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" Name")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" Phone No")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" Contact Address")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" Occupation")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" Type Of Affected Structure")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" Location")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" GPS Coordinates")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" PAP's Picture")],
                    }),
                    new TableCell({
                        children: [new Paragraph(" Picture Of Affected Structure")],
                    }),
                ],
            })
        ]        

        dt.current.props.value.map((value) => {
            
            const image1 = imgBlobArray.find(x => x.id === value.id).image;
            
            dtTableRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("1")],
                        }),

                        new TableCell( {
                            children: [new Paragraph(value.title)],
                        }),

                        new TableCell({
                            children: [new Paragraph(value.hhf && value.hhf.pap_phone ? value.hhf.pap_phone: "---")],
                        }),
                        new TableCell({
                            children: [new Paragraph(value.address ? value.address: "")],
                        }),
                        new TableCell({
                            children: [new Paragraph(value.hhf && value.hhf.occupation ? value.hhf.occupation: "---")],
                        }),
                        new TableCell({
                            children: [new Paragraph(value.hhf && value.hhf.prop_type ? value.hhf.prop_type: "---")],
                        }),
                        
                        new TableCell({
                            children: [new Paragraph("")],
                        }),

                        new TableCell({
                            children: [new Paragraph("")],
                        }),

                        new TableCell({
                            children: [new Paragraph(image1)],
                            width: {
                                size: 60,
                                type: WidthType.DXA
                            }
                        }),

                        new TableCell({
                            children: [new Paragraph(image1)],
                            width: {
                                size: 60,
                                type: WidthType.DXA
                            }
                        }),
                    ],
                })
            )
        }); 

        return dtTableRows; 
    }

    const generateFromUrl = async () => {
        setLoader(true)
        const getImages = async() => {          
            var storageRef = firebase.storage().ref();   
            dt.current.props.value.map((value) => {
                storageRef.child(`images/pap_image/${value.id}.png`)
                    .getDownloadURL()
                        .then(async (url) => {
                            const blob = await fetch(url).then(r => r.blob());
                            const image1 = Media.addImage(doc, blob, 60,60);
                            imgBlobArray.push({id:`${value.id}`, image: image1});
                            setRandomStr(imgBlobArray.length)
                        })
                        .catch((error) => {
                            // setRandomStr(JSON.stringify({id:`${value.id}`, image:`No image`}))
                            imgBlobArray.push({id:`${value.id}`, image:`No image`});
                            setRandomStr(imgBlobArray.length)
                            //console.log(imgBlobArray.length)
                        })
            })           
        }

        if (!imageReady) await getImages()

        if (randomStr && imageReady) {
            console.log('downloading again...')
            Packer.toBlob(doc).then(blob => {
                saveAs(blob, "example.docx");
                console.log("Document created successfully");
                setLoader(false);
            });
        }        
    };

    const customer2TableHeader = (
        <div className="table-header">
            List of Project Affected Persons
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter2} onChange={(e) => setGlobalFilter2(e.target.value)} placeholder="Global Search" />
            </span>
        </div>
    );

    const nameBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {data.name}
            </>
        );
    };

    const countryBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Country</span>
                <img src="assets/demo/images/flags/flag_placeholder.png" alt={data.country.name} className={`flag flag-${data.country.code}`} width={30} height={20} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.country.name}</span>
            </>
        );
    };

    const representativeBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Representative</span>
                <img alt={data.representative.name} src={`assets/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.representative.name}</span>
            </>
        );
    };

    const dateBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {data.date}
            </>
        );
    };

    const updatedAtBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {moment(data.updatedAt).format("YYYY-MM-DD")}
            </>
        );
    };

    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${data.status}`}>{data.status}</span>
            </>
        )
    };

    const activityBody = (data) => {
        return (
            <>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={data.activity} showValue={false} />
            </>
        )
    };

    const titleBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Title</span>
                {data.title}
            </>
        );
    };

    const projectBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Project</span>
                {data.project}
            </>
        );
    };

    const enumeratorBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Enumerator</span>
                {data.createdBy}
            </>
        );
    };

    const actionViewTemplate = () => <Button type="button" icon="pi pi-pencil" className="p-button-secondary" onClick={onClickEditHandler}></Button>;
    
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" /> */}
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
                <Button label={loader ? "loading..." : "Export(.docx)"} icon="pi pi-upload" disabled={loader} className="p-button-help" onClick={generateFromUrl} />
            </React.Fragment>
        )
    }

    const onClickEditHandler = (event) => {
        event.preventDefault();
       // console.log('...current user', auth.currentUser.email)
    }

    const exportCSV = () => {
        console.log('dt..', dt)
        dt.current.exportCSV();
    }

    return (
        <div className="p-grid table-demo">
            <div className="p-col-12">
                <div className="card">
                    <h5>Customized</h5>
                    <p>Scrollable table with gridlines (<mark>.p-datatable-gridlines</mark>), striped rows (<mark>.p-datatable-striped</mark>) and smaller paddings (<mark>p-datatable-sm</mark>).</p>
                  
                    <Toolbar className="p-mb-4"  right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={pap} paginator className="p-datatable-gridlines p-datatable-striped p-datatable-sm p-datatable-responsive p-datatable-customers"
                        rows={10} dataKey="id" rowHover selection={selectedCustomers2} onSelectionChange={(e) => setSelectedCustomers2(e.value)}
                        globalFilter={globalFilter2} emptyMessage="No PAP found." loading={loading1} header={customer2TableHeader}>
                        {/* <Column field="title" header="title" sortable body={nameBodyTemplate}></Column>
                        <Column field="country.name" header="Country" sortable body={countryBodyTemplate}></Column>
                        <Column field="representative.name" header="Representative" sortable body={representativeBodyTemplate}></Column>
                        <Column field="date" header="Date" sortable body={dateBodyTemplate}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column field="activity" header="Activity" sortable body={activityBody}></Column> */}
                        <Column field="title" header="Name" sortable body={titleBodyTemplate}></Column>
                        <Column field="project" header="Project" sortable body={projectBodyTemplate}></Column>
                        <Column field="updatedAt" header="Date" sortable body={updatedAtBodyTemplate}></Column>
                        <Column field="createdBy" header="Enumerator" sortable body={enumeratorBodyTemplate}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate}></Column>
                        <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionViewTemplate}></Column>
                    </DataTable>
                </div>
            </div>
           
        </div>
    )
}
