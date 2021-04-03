import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { InputNumber } from 'primereact/inputnumber';
import classNames from 'classnames';
import { PapService } from '../service/PapService';
import { StateService } from '../service/StateService';
import firebase, { auth, generateUserDocument, firestore } from '../FirebaseConfig';
import { Calendar } from 'primereact/calendar';
import moment from 'moment'
import { Redirect } from 'react-router-dom'

export const PAPDetails = () => {

    let emptyDependant = {
        id: null,
        name: '',
        sex: '',
        dob: '',
        relationship: '',
        residence: '',
        ocupation: '',
        education: '',
        vulnerability_issues: ''
    };


    const [pap, setPap] = useState(null);
    const [dropdownPropType, setDropdownPropType] = useState(null);
    const [dropdownGender, setDropdownGender] = useState(null);
    const [dropdownHHHGender, setDropdownHHHGender] = useState(null);
    const [dropdownDEPGender, setDropdownDEPGender] = useState(null);
    const [dropdownMaritalStatus, setDropdownMaritalStatus] = useState(null);
    const [multiselectIncomeValue, setMultiselectIncomeValue] = useState(null);
    const [multiselectExpenseValue, setMultiselectExpenseValue] = useState(null);
    const [inputGroupValue, setInputGroupValue] = useState(false);
    const [dropdownLGAs, setDropdownLGAs] = useState(null);
    const [dropdownLGAsOrigin, setDropdownLGAsOrigin] = useState(null);
    const [dropdownPAPLgas, setDropdownPAPLgas] = useState(null);
    // const [calendarValue, setCalendarValue] = useState(null);

    const [dependants, setDependants] = useState(null);
    const [DependantDialog, setDependantDialog] = useState(false);
    const [deleteDependantDialog, setDeleteDependantDialog] = useState(false);
    const [deleteDependantsDialog, setDeleteDependantsDialog] = useState(false);
    const [dependant, setDependant] = useState(emptyDependant);
    const [selectedDependants, setSelectedDependants] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const papService = new PapService();
        papService.getPaps().then(data => {    
            setPap(data);
            SetLGAsOfOrigin(data.hhf.pap_stateOfOrigin);
            SetLGAsPAP(data.state);
            const DependantsWithID =[];
            data.hhf.pap_dependants.map((value) => DependantsWithID.push({id:createId(), ...value}))
            setDependants(DependantsWithID);
        });
        
        // .then(
        //    SetLGAsOfOrigin(pap.hhf.pap_stateOfOrigin),
        // );
     
          //  
           // 
            //SetLGAs(pap.state),
            
       

    //    let res = papService.getPaps();
    //    console.log('res...', pap)

    //     var docRef = firestore.collection("surveys").doc("566235c2-0c60-4f1e-b12f-cb2c99604226");

    //     docRef.get().then((doc) => {
    //         if (doc.exists) {
    //             setPap(doc.data());
    //             console.log("Document data:", doc.data());

    //             SetLGAsOfOrigin(doc.data().hhf.pap_stateOfOrigin);
    //             SetLGAsPAP(doc.data().state);
    //             const DependantsWithID =[];
    //             doc.data().hhf.pap_dependants.map((value) => DependantsWithID.push({id:createId(), ...value}))
    //             setDependants(DependantsWithID);
    
    //         } else {
    //             // doc.data() will be undefined in this case
    //             console.log("No such document!");
    //         }
    //     }).catch((error) => {
    //         console.log("Error getting document:", error);
    //     });

    }, []);

    const openNew = () => {
        console.log('openNew...pap...', pap)
        setDependant(emptyDependant);
        setSubmitted(false);
        setDependantDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setDependantDialog(false);
    }

    const hidedeleteDependantDialog = () => {
        setDeleteDependantDialog(false);
    }

    const hidedeleteDependantsDialog = () => {
        setDeleteDependantsDialog(false);
    }

    const saveDependant = () => {
        setSubmitted(true);

        if (dependant.name.trim()) {
            let _dependants = [...dependants];
            let _dependant = { ...dependant };
            if (dependant.id) {
                
                const index = findIndexById(dependant.id);
                console.log('id==>>', dependant.id)
                console.log('index==>>', index)

                _dependants[index] = _dependant;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Dependant Updated', life: 3000 });
            }
            else {
                console.log('null==>>',dependant.id )
                _dependant.id = createId();
                _dependants.push(_dependant);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Dependant Created', life: 3000 });
            }

            setDependants(_dependants);

            let _pap = { ...pap };
            _pap.hhf.pap_dependants = _dependants;
            setPap(_pap);
             console.log('pap...', pap)

            setDependantDialog(false);
            setDependant(emptyDependant);
        }

        console.log('dependants...', dependants)
    }

    const editDependant = (dependant) => {
        setDependant({ ...dependant });

        setDependantDialog(true);
        console.log('edit dependants...', dependants)
    }

    const confirmDeleteProduct = (dependant) => {
        setDependant(dependant);
        setDeleteDependantDialog(true);
    }

    const deleteDependant = () => {
        let _dependants = dependants.filter(val => val.id !== dependant.id);
        setDependants(_dependants);
        let _pap = { ...pap };
        _pap.hhf.pap_dependants = _dependants;
        setPap(_pap);
        //console.log('pap...', pap)
        setDeleteDependantDialog(false);
        setDependant(emptyDependant);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < dependants.length; i++) {
            if (dependants[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteDependantsDialog(true);
    }

    const deleteselectedDependants = () => {
        let _dependants = dependants.filter(val => !selectedDependants.includes(val));
        setDependants(_dependants);
        let _pap = { ...pap };
        _pap.hhf.pap_dependants = _dependants;
        setPap(_pap);
        //console.log('pap...', pap)
        setDeleteDependantsDialog(false);
        setSelectedDependants(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Dependants Deleted', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _pap = { ...pap };
        _pap[`${name}`] = val;
        setPap(_pap);
    }

    const onInputChange_pap = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _pap = { ...pap };
        _pap.hhf[`${name}`] = val;
        setPap(_pap);
    }

    const onInputChange_dep = (e, name) => {
        const val = (e.target && e.target.value) || '';
        console.log("...val", val)
        let _dependant = { ...dependant };
        _dependant[`${name}`] = val;
        setDependant(_dependant);
    }

    const onDropdownChange_pap =(e, name) => {
        if(name == 'pap_stateOfOrigin') SetLGAsOfOrigin (e.value.name);
      //console.log('name..', name)
        let _pap = { ...pap };
        _pap.hhf[`${name}`] = e.value.name;
        setPap(_pap);
    }

    const onDropdownChange = (e, name) => {  
        if(name == 'state') SetLGAsPAP(e.value.name);
         let _pap = { ...pap };
        _pap[`${name}`] = e.value.name;
        setPap(_pap);
    }

    const onMultiDropDownChange = (e, name) => {
         let _pap = { ...pap };
         const newArray = [];
         e.value.map((value) => {
             newArray.push(value.name)
         })    
        _pap.hhf[`${name}`] = newArray;
        setPap(_pap);
    }

    function SetLGAsOfOrigin (stateOfOrigin){
        let lgasOfOrigin = AllStates[`${ stateOfOrigin}`].map((value) => {
            return {name:`${value}`, code:`${value}`}   
        })
        setDropdownLGAsOrigin(lgasOfOrigin)
     }

     function SetLGAsPAP (state){
        let lgas = AllStates[`${ state}`].map((value) => {
            return {name:`${value}`, code:`${value}`}   
        })
        setDropdownPAPLgas(lgas)
     }
     
    const onDropdownChange_dep =(e, name) => {
         let _dependant = { ...dependant };
        _dependant[`${name}`] = e.value.name;
         setDependant(_dependant);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _dependant = { ...dependant };
        _dependant[`${name}`] = val;
        setDependant(_dependant);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDependants || !selectedDependants.length} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    }

    const genderBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Gender</span>
                {rowData.sex}
            </>
        );
    }

    const relationshipBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.relationship}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDependant(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Manage Dependants</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const DependantDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveDependant} />
        </>
    );
    const deleteDependantDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteDependantDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteDependant} />
        </>
    );
    const deleteDependantsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hidedeleteDependantsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteselectedDependants} />
        </>
    );

    const dropdownGenders = [
        { name: 'Male', code: 'Male' },
        { name: 'Female', code: 'Female' },
    ];


    const dropdownFoodProds = [
        { name: 'Significant', code: 'Significant' },
        { name: 'Not Significant', code: 'Not Significant' },
        { name: 'Very Significant', code: 'Very Significant' },
    ];
    
    const dropdownCompensation = [
        { name: 'Cash only', code: 'Cash only' },
        { name: 'Replacement of land and house', code: 'Replacement of land and house' },
        { name: 'Cash compensation for both land and house', code: 'Cash compensation for both land and house' },
        { name: 'Replacement of land and cash compensation for house', code: 'Replacement of land and cash compensation for house' },
        { name: 'Does not know', code: 'Does not know' },
        { name: 'Others', code: 'Others' }
    ];

    const dropdownResType = [
        { name: 'Resident', code: 'Resident' },
        { name: 'Non-Resident', code: 'Non-Resident' },
    ];

    const dropdownPropOwner = [
        { name: 'Landlord', code: 'Landlord' },
        { name: 'Tenant', code: 'Tenant' },
    ];

    const dropdownMaritalStatuses = [
        { name: 'Single', code: 'Single' },
        { name: 'Married', code: 'Married' },
        { name: 'Separated', code: 'Separated' },
        { name: 'Divorced', code: 'Divorced' },
        { name: 'Widow(er)', code: 'Widow(er)' },
    ];

    const dropdownAvgIncomes = [
        { name: '0-50,000', code: '0-50,000' },
        { name: '50,000-100,000', code: '50,000-100,000' },
        { name: '101,000-500,000', code: '101,000-500,000' },
        { name: 'Above 500,000', code: 'Above 500,000' },
    ];

    const dropdownEduStatuses = [
        { name: 'Cannot read and write', code: 'Cannot read and write' },
        { name: 'Has completed Primary', code: 'Has completed Primary' },
        { name: 'Has completed Secondary', code: 'Has completed Secondary' },
        { name: 'Has University degree', code: 'Has University degree' }
    ];

    const dropdownReligions = [
        { name: 'Christian', code: 'Christian' },
        { name: 'Muslim', code: 'Muslim' },
        { name: 'Traditional', code: 'Traditional' },
        { name: 'Other', code: 'Other' }
    ];

    const dropdownIdType = [
        { name: "Voters Card", code: "Voters Card" },
        { name: 'National ID', code:'National ID' },
        { name: "Driver's License", code: "Driver's License" },
        { name: 'International Passport', code: 'International Passport' },
        { name: 'Other', code: 'Other' }
    ];

    const  dropdownPropTypes = [
        { name: 'Church', code: 'Church' },
        { name: 'Mosque', code: 'Mosque' },
        { name: 'Agricultural Plot', code: 'Agricultural Plot' },
        { name: 'Plot with business', code: 'Plot with business' },
        { name: 'Residential plot with residential building', code: 'Residential plot with residential building' },
        { name: 'Cultural Heritage(Shrine)', code: 'Cultural Heritage(Shrine)' },
        { name: 'Cultural Heritage(Graveyard)', code: 'Cultural Heritage(Graveyard)' },
        { name: 'Cultural Heritage(Artifacts)', code: 'Cultural Heritage(Artifacts)' },
        { name: 'Others', code: 'Others' }
    ];
   
    const dropdownEthnics = [
        { name: 'Hausa', code: 'Hausa' },
        { name: 'Igbo', code: 'Igbo' },
        { name: 'Yoruba', code: 'Yoruba' },
        { name: 'Fulani', code: 'Fulani' },
        { name: 'Other', code: 'Other' }
    ];
    
    const dropdownRelationship = [
        { name: 'Spouse', code: 'Spouse' },
        { name: 'Child', code: 'Child' },
        { name: 'Grandchild', code: 'Grandchild' },
        { name: 'Parent', code: 'Parent' },
        { name: 'Grandparent', code: 'Grandparent' },
        { name: 'Other', code: 'Other' }
    ];

    const dropdownEducLevel = [
        { name: 'Primary', code: 'Primary' },
        { name: 'Secondary', code: 'Secondary' },
        { name: 'Technical', code: 'Technical' },
        { name: 'Higher Institution', code: 'Higher Institution' },
        { name: 'None(primary not completed)', code: 'None(primary not completed)' }
    ];

    const dropdownVulnerability = [
        { name: 'Physical handicap', code: 'Physical handicap' },
        { name: 'Mental handicap', code: 'Mental handicap' },
        { name: 'Chronic Disease with regular medication', code: 'Chronic Disease with regular medication' },
        { name: 'Chronic Disease with Hospitalization', code: 'Chronic Disease with Hospitalization' },
        { name: 'Elderly', code: 'Elderly' },
        { name: 'Other', code: 'Other' },
        { name: 'None', code: 'None' }
    ];

    const dropdownOccupation = [
        { name: 'Farmer', code: 'Farmer' },
        { name: 'Agricultural labourer', code: 'Agricultural labourer' },
        { name: 'Housewife', code: 'Housewife' },
        { name: 'Small business owner', code: 'Small business owner' },
        { name: 'Utility Employee', code: 'Utility Employee' },
        { name: 'Government Employee', code: 'Government Employee' },
        { name: 'Private Business Employee', code: 'Private Business Employee' },
        { name: 'Pensioner', code: 'Pensioner' },
        { name: 'Preschool Child', code: 'Preschool Child' },
        { name: 'Primary School Student', code: 'Primary School Student' },
        { name: 'Secondary School Student', code: 'Secondary School Student' },
        { name: 'University Student', code: 'University Student' },
        { name: 'Unemployed', code: 'Unemployed' }      
    ];

    const isPAPHHH_dropdown = [
        { name: 'Yes', code: 'Yes' },
        { name: 'No', code: 'No' }
    ];

    const dropdownStates = [
            { name: "Abia", code: "Abia"},
            { name: "Adamawa", code: "Adamawa"},
            { name: "Akwa Ibom", code: "Akwa Ibom"},
            { name: "Anambra", code: "Anambra"},
            { name: "Bauchi", code: "Bauchi"},
            { name: "Bauchi", code: "Bauchi"},
            { name: "Benue", code: "Benue"},
            { name: "Borno", code: "Borno"},
            { name: "Cross River", code: "Cross River"},
            { name: "Delta", code: "Delta"},
            { name: "Ebonyi", code: "Ebonyi"},
            { name: "Edo", code: "Edo"},
            { name: "", code: "Ekiti"},
            { name: "Ekiti", code: "Enugu"},
            { name: "FCT - Abuja", code: "FCT - Abuja"},
            { name: "Gombe", code: "Gombe"},
            { name: "Imo", code: "Imo"},
            { name: "Jigawa", code: "Jigawa"},
            { name: "Kaduna", code: "Kaduna"},
            { name: "Kano", code: "Kano"},
            { name: "Katsina", code: "Katsina"},
            { name: "Kebbi", code: "Kebbi"},
            { name: "Kogi", code: "Kogi"},
            { name: "Kwara", code: "Kwara"},
            { name: "Lagos", code: "Lagos"},
            { name: "Nasarawa", code: "Nasarawa"},
            { name: "Niger", code: "Niger"},
            { name: "Ogun", code: "Ogun"},
            { name: "Ondo", code: "Ondo"},
            { name: "Osun", code: "Osun"},
            { name: "Oyo", code: "Oyo"},
            { name: "Plateau", code: "Plateau"},
            { name: "Rivers", code: "Rivers"},
            { name: "Sokoto", code: "Sokoto"},
            { name: "Taraba", code: "Taraba"},
            { name: "Yobe", code: "Yobe"},
            { name: "Zamfara", code: "Zamfara"}        
    ];

    const AllStates = {
        "Abia": [ 
                    "Aba North",
                    "Aba South",
                    "Arochukwu",
                    "Bende",
                    "Ikwuano",
                    "Isiala Ngwa North",
                    "Isiala Ngwa South",
                    "Isuikwuato",
                    "Obi Ngwa",
                    "Ohafia",
                    "Osisioma",
                    "Ugwunagbo",
                    "Ukwa East",
                    "Ukwa West",
                    "Umu Nneochi",
                    "Umuahia North",
                    "Umuahia South",
                ],
        "Adamawa": [
                    "Demsa",
                    "Fufure",
                    "Ganye",
                    "Gayuk",
                    "Gombi",
                    "Grie",
                    "Hong",
                    "Jada",
                    "Lamurde",
                    "Madagali",
                    "Maiha",
                    "Mayo Belwa",
                    "Michika",
                    "Mubi North",
                    "Mubi South",
                    "Numan",
                    "Shelleng",
                    "Song",
                    "Toungo",
                    "Yola North",
                    "Yola South"
                    ],
        "Akwa Ibom": [
                    "Abak",
                    "Eastern Obolo",
                    "Eket",
                    "Esit Eket",
                    "Essien Udim",
                    "Etim Ekpo",
                    "Etinan",
                    "Ibeno",
                    "Ibesikpo Asutan",
                    "Ibiono-Ibom",
                    "Ika",
                    "Ikono",
                    "Ikot Abasi",
                    "Ikot Ekpene",
                    "Ini",
                    "Itu",
                    "Mbo",
                    "Mkpat-Enin",
                    "Nsit-Atai",
                    "Nsit-Ibom",
                    "Nsit-Ubium",
                    "Obot Akara",
                    "Okobo",
                    "Onna",
                    "Oron",
                    "Oruk Anam",
                    "Udung-Uko",
                    "Ukanafun",
                    "Uruan",
                    "Urue-Offong/Oruko",
                    "Uyo"
                    ],
        "Anambra": [
                    "Aguata",
                    "Anambra East",
                    "Anambra West",
                    "Anaocha",
                    "Awka North",
                    "Awka South",
                    "Ayamelum",
                    "Dunukofia",
                    "Ekwusigo",
                    "Idemili North",
                    "Idemili South",
                    "Ihiala",
                    "Njikoka",
                    "Nnewi North",
                    "Nnewi South",
                    "Ogbaru",
                    "Onitsha North",
                    "Onitsha South",
                    "Orumba North",
                    "Orumba South",
                    "Oyi"
                    ],
        "Bauchi": [
                    "Alkaleri",
                    "Bauchi",
                    "Bogoro",
                    "Damban",
                    "Darazo",
                    "Dass",
                    "Gamawa",
                    "Ganjuwa",
                    "Giade",
                    "Itas/Gadau",
                    "Jama'are",
                    "Katagum",
                    "Kirfi",
                    "Misau",
                    "Ningi",
                    "Shira",
                    "Tafawa Balewa",
                    "Toro",
                    "Warji",
                    "Zaki"
                    ],
        "Bayelsa": [
                    "Brass",
                    "Ekeremor",
                    "Kolokuma/Opokuma",
                    "Nembe",
                    "Ogbia",
                    "Sagbama",
                    "Southern Ijaw",
                    "Yenagoa"
                    ],
        "Benue": [
                    "Ado",
                    "Agatu",
                    "Apa",
                    "Buruku",
                    "Gboko",
                    "Guma",
                    "Gwer East",
                    "Gwer West",
                    "Katsina-Ala",
                    "Konshisha",
                    "Kwande",
                    "Logo",
                    "Makurdi",
                    "Obi",
                    "Ogbadibo",
                    "Ohimini",
                    "Oju",
                    "Okpokwu",
                    "Oturkpo",
                    "Tarka",
                    "Ukum",
                    "Ushongo",
                    "Vandeikya"
                    ],
        "Borno": [
                    "Abadam",
                    "Askira/Uba",
                    "Bama",
                    "Bayo",
                    "Biu",
                    "Chibok",
                    "Damboa",
                    "Dikwa",
                    "Gubio",
                    "Guzamala",
                    "Gwoza",
                    "Hawul",
                    "Jere",
                    "Kaga",
                    "Kala/Balge",
                    "Konduga",
                    "Kukawa",
                    "Kwaya Kusar",
                    "Mafa",
                    "Magumeri",
                    "Maiduguri",
                    "Marte",
                    "Mobbar",
                    "Monguno",
                    "Ngala",
                    "Nganzai",
                    "Shani"],
        "Cross River": [
                    "Abi",
                    "Akamkpa",
                    "Akpabuyo",
                    "Bakassi",
                    "Bekwarra",
                    "Biase",
                    "Boki",
                    "Calabar Municipal",
                    "Calabar South",
                    "Etung",
                    "Ikom",
                    "Obanliku",
                    "Obubra",
                    "Obudu",
                    "Odukpani",
                    "Ogoja",
                    "Yakuur",
                    "Yala"],
        "Delta": [
                    "Aniocha North",
                    "Aniocha South",
                    "Bomadi",
                    "Burutu",
                    "Ethiope East",
                    "Ethiope West",
                    "Ika North East",
                    "Ika South",
                    "Isoko North",
                    "Isoko South",
                    "Ndokwa East",
                    "Ndokwa West",
                    "Okpe",
                    "Oshimili North",
                    "Oshimili South",
                    "Patani",
                    "Sapele",
                    "Udu",
                    "Ughelli North",
                    "Ughelli South",
                    "Ukwuani",
                    "Uvwie",
                    "Warri North",
                    "Warri South West",
                    "Warri South"],
        "Ebonyi": [
                    "Abakaliki",
                    "Afikpo North",
                    "Afikpo South (Edda)",
                    "Ebonyi",
                    "Ezza North",
                    "Ezza South",
                    "Ikwo",
                    "Ishielu",
                    "Ivo",
                    "Izzi",
                    "Ohaozara",
                    "Ohaukwu",
                    "Onicha"],
        "Edo": [
                    "Akoko-Edo",
                    "Egor",
                    "Esan Central",
                    "Esan North-East",
                    "Esan South-East",
                    "Esan West",
                    "Etsako Central",
                    "Etsako East",
                    "Etsako West",
                    "Igueben",
                    "Ikpoba Okha",
                    "Oredo",
                    "Orhionmwon",
                    "Ovia North-East",
                    "Ovia South-West",
                    "Owan East",
                    "Owan West",
                    "Uhunmwonde"],
        "Ekiti": [
                    "Ado Ekiti",
                    "Efon",
                    "Ekiti East",
                    "Ekiti South-West",
                    "Ekiti West",
                    "Emure",
                    "Gbonyin",
                    "Ido Osi",
                    "Ijero",
                    "Ikere",
                    "Ikole",
                    "Ilejemeje",
                    "Irepodun/Ifelodun",
                    "Ise/Orun",
                    "Moba",
                    "Oye"],
        "Enugu": [
                    "Aninri",
                    "Awgu",
                    "Enugu East",
                    "Enugu North",
                    "Enugu South",
                    "Ezeagu",
                    "Igbo Etiti",
                    "Igbo Eze North",
                    "Igbo Eze South",
                    "Isi Uzo",
                    "Nkanu East",
                    "Nkanu West",
                    "Nsukka",
                    "Oji River",
                    "Udenu",
                    "Udi",
                    "Uzo-Uwani"],
        "Federal Capital Territory": [
                    "Abaji",
                    "Abuja Municipal Area Council",
                    "Bwari",
                    "Gwagwalada",
                    "Kuje",
                    "Kwali"],
        "Gombe": [
                    "Akko",
                    "Balanga",
                    "Billiri",
                    "Dukku",
                    "Funakaye",
                    "Gombe",
                    "Kaltungo",
                    "Kwami",
                    "Nafada",
                    "Shongom",
                    "Yamaltu/Deba"],
        "Imo": [
                    "Aboh Mbaise",
                    "Ahiazu Mbaise",
                    "Ehime Mbano",
                    "Ezinihitte",
                    "Ideato North",
                    "Ideato South",
                    "Ihitte/Uboma",
                    "Ikeduru",
                    "Isiala Mbano",
                    "Isu",
                    "Mbaitoli",
                    "Ngor Okpala",
                    "Njaba",
                    "Nkwerre",
                    "Nwangele",
                    "Obowo",
                    "Oguta",
                    "Ohaji/Egbema",
                    "Okigwe",
                    "Orlu",
                    "Orsu",
                    "Oru East",
                    "Oru West",
                    "Owerri Municipal",
                    "Owerri North",
                    "Owerri West",
                    "Unuimo"],
        "Jigawa": [
                    "Auyo",
                    "Babura",
                    "Biriniwa",
                    "Birnin Kudu",
                    "Buji",
                    "Dutse",
                    "Gagarawa",
                    "Garki",
                    "Gumel",
                    "Guri",
                    "Gwaram",
                    "Gwiwa",
                    "Hadejia",
                    "Jahun",
                    "Kafin Hausa",
                    "Kaugama",
                    "Kazaure",
                    "Kiri Kasama",
                    "Kiyawa",
                    "Maigatari",
                    "Malam Madori",
                    "Miga",
                    "Ringim",
                    "Roni",
                    "Sule Tankarkar",
                    "Taura",
                    "Yankwashi"],
        "Kaduna": [
                    "Birnin Gwari",
                    "Chikun",
                    "Giwa",
                    "Igabi",
                    "Ikara",
                    "Jaba",
                    "Jema'a",
                    "Kachia",
                    "Kaduna North",
                    "Kaduna South",
                    "Kagarko",
                    "Kajuru",
                    "Kaura",
                    "Kauru",
                    "Kubau",
                    "Kudan",
                    "Lere",
                    "Makarfi",
                    "Sabon Gari",
                    "Sanga",
                    "Soba",
                    "Zangon Kataf",
                    "Zaria"],
        "Kano": [
                    "Ajingi",
                    "Albasu",
                    "Bagwai",
                    "Bebeji",
                    "Bichi",
                    "Bunkure",
                    "Dala",
                    "Dambatta",
                    "Dawakin Kudu",
                    "Dawakin Tofa",
                    "Doguwa",
                    "Fagge",
                    "Gabasawa",
                    "Garko",
                    "Garun Mallam",
                    "Gaya",
                    "Gwale",
                    "Gwarzo",
                    "Kabo",
                    "Kano Municipal",
                    "Karaye",
                    "Kibiya",
                    "Kiru",
                    "Kumbotso",
                    "Kunchi",
                    "Kura",
                    "Madobi",
                    "Makoda",
                    "Minjibir",
                    "Nasarawa",
                    "Rano",
                    "Rimin Gado",
                    "Rogo",
                    "Shanono",
                    "Sumaila",
                    "Takai",
                    "Tarauni",
                    "Tofa",
                    "Tsanyawa",
                    "Tudun Wada",
                    "Ungogo",
                    "Warawa",
                    "Wudil"],
        "Katsina": [
                    "Bakori",
                    "Batagarawa",
                    "Batsari",
                    "Baure",
                    "Bindawa",
                    "Charanchi",
                    "Dan Musa",
                    "Dandume",
                    "Danja",
                    "Daura",
                    "Dutsi",
                    "Dutsin Ma",
                    "Faskari",
                    "Funtua",
                    "Ingawa",
                    "Jibia",
                    "Kafur",
                    "Kaita",
                    "Kankara",
                    "Kankia",
                    "Katsina",
                    "Kurfi",
                    "Kusada",
                    "Mai'Adua",
                    "Malumfashi",
                    "Mani",
                    "Mashi",
                    "Matazu",
                    "Musawa",
                    "Rimi",
                    "Sabuwa",
                    "Safana",
                    "Sandamu",
                    "Zango"],
        "Kebbi": [
                    "Aleiro",
                    "Arewa Dandi",
                    "Argungu",
                    "Augie",
                    "Bagudo",
                    "Birnin Kebbi",
                    "Bunza",
                    "Dandi",
                    "Fakai",
                    "Gwandu",
                    "Jega",
                    "Kalgo",
                    "Koko/Besse",
                    "Maiyama",
                    "Ngaski",
                    "Sakaba",
                    "Shanga",
                    "Suru",
                    "Wasagu/Danko",
                    "Yauri",
                    "Zuru"],
        "Kogi": [
                    "Adavi",
                    "Ajaokuta",
                    "Ankpa",
                    "Bassa",
                    "Dekina",
                    "Ibaji",
                    "Idah",
                    "Igalamela Odolu",
                    "Ijumu",
                    "Kabba/Bunu",
                    "Kogi",
                    "Lokoja",
                    "Mopa Muro",
                    "Ofu",
                    "Ogori/Magongo",
                    "Okehi",
                    "Okene",
                    "Olamaboro",
                    "Omala",
                    "Yagba East",
                    "Yagba West"],
        "Kwara": [
                    "Asa",
                    "Baruten",
                    "Edu",
                    "Ekiti",
                    "Ifelodun",
                    "Ilorin East",
                    "Ilorin South",
                    "Ilorin West",
                    "Irepodun",
                    "Isin",
                    "Kaiama",
                    "Moro",
                    "Offa",
                    "Oke Ero",
                    "Oyun",
                    "Pategi"],
        "Lagos": [
                    "Agege",
                    "Ajeromi-Ifelodun",
                    "Alimosho",
                    "Amuwo-Odofin",
                    "Apapa",
                    "Badagry",
                    "Epe",
                    "Eti Osa",
                    "Ibeju-Lekki",
                    "Ifako-Ijaiye",
                    "Ikeja",
                    "Ikorodu",
                    "Kosofe",
                    "Lagos Island",
                    "Lagos Mainland",
                    "Mushin",
                    "Ojo",
                    "Oshodi-Isolo",
                    "Shomolu",
                    "Surulere"],
        "Nasarawa": [
                    "Akwanga",
                    "Awe",
                    "Doma",
                    "Karu",
                    "Keana",
                    "Keffi",
                    "Kokona",
                    "Lafia",
                    "Nasarawa Egon",
                    "Nasarawa",
                    "Obi",
                    "Toto",
                    "Wamba"],
        "Niger": [
                    "Agaie",
                    "Agwara",
                    "Bida",
                    "Borgu",
                    "Bosso",
                    "Chanchaga",
                    "Edati",
                    "Gbako",
                    "Gurara",
                    "Katcha",
                    "Kontagora",
                    "Lapai",
                    "Lavun",
                    "Magama",
                    "Mariga",
                    "Mashegu",
                    "Mokwa",
                    "Moya",
                    "Paikoro",
                    "Rafi",
                    "Rijau",
                    "Shiroro",
                    "Suleja",
                    "Tafa",
                    "Wushishi"],
        "Ogun": [
                    "Abeokuta North",
                    "Abeokuta South",
                    "Ado-Odo/Ota",
                    "Ewekoro",
                    "Ifo",
                    "Ijebu East",
                    "Ijebu North East",
                    "Ijebu North",
                    "Ijebu Ode",
                    "Ikenne",
                    "Imeko Afon",
                    "Ipokia",
                    "Obafemi Owode",
                    "Odeda",
                    "Odogbolu",
                    "Ogun Waterside",
                    "Remo North",
                    "Shagamu",
                    "Yewa North",
                    "Yewa South"],
        "Ondo": [
                    "Akoko North-East",
                    "Akoko North-West",
                    "Akoko South-East",
                    "Akoko South-West",
                    "Akure North",
                    "Akure South",
                    "Ese Odo",
                    "Idanre",
                    "Ifedore",
                    "Ilaje",
                    "Ile Oluji/Okeigbo",
                    "Irele",
                    "Odigbo",
                    "Okitipupa",
                    "Ondo East",
                    "Ondo West",
                    "Ose",
                    "Owo"],
        "Osun": [
                    "Aiyedaade",
                    "Aiyedire",
                    "Atakunmosa East",
                    "Atakunmosa West",
                    "Boluwaduro",
                    "Boripe",
                    "Ede North",
                    "Ede South",
                    "Egbedore",
                    "Ejigbo",
                    "Ife Central",
                    "Ife East",
                    "Ife North",
                    "Ife South",
                    "Ifedayo",
                    "Ifelodun",
                    "Ila",
                    "Ilesa East",
                    "Ilesa West",
                    "Irepodun",
                    "Irewole",
                    "Isokan",
                    "Iwo",
                    "Obokun",
                    "Odo Otin",
                    "Ola Oluwa",
                    "Olorunda",
                    "Oriade",
                    "Orolu",
                    "Osogbo"],
        "Oyo": [
                    "Afijio",
                    "Akinyele",
                    "Atiba",
                    "Atisbo",
                    "Egbeda",
                    "Ibadan North",
                    "Ibadan North-East",
                    "Ibadan North-West",
                    "Ibadan South-East",
                    "Ibadan South-West",
                    "Ibarapa Central",
                    "Ibarapa East",
                    "Ibarapa North",
                    "Ido",
                    "Irepo",
                    "Iseyin",
                    "Itesiwaju",
                    "Iwajowa",
                    "Kajola",
                    "Lagelu",
                    "Ogbomosho North",
                    "Ogbomosho South",
                    "Ogo Oluwa",
                    "Olorunsogo",
                    "Oluyole",
                    "Ona Ara",
                    "Orelope",
                    "Ori Ire",
                    "Oyo East",
                    "Oyo West",
                    "Saki East",
                    "Saki West",
                    "Surulere"],
        "Plateau": [
                    "Barkin Ladi",
                    "Bassa",
                    "Bokkos",
                    "Jos East",
                    "Jos North",
                    "Jos South",
                    "Kanam",
                    "Kanke",
                    "Langtang North",
                    "Langtang South",
                    "Mangu",
                    "Mikang",
                    "Pankshin",
                    "Qua'an Pan",
                    "Riyom",
                    "Shendam",
                    "Wase"],
        "Rivers": [
                    "Abua/Odual",
                    "Ahoada East",
                    "Ahoada West",
                    "Akuku-Toru",
                    "Andoni",
                    "Asari-Toru",
                    "Bonny",
                    "Degema",
                    "Eleme",
                    "Emuoha",
                    "Etche",
                    "Gokana",
                    "Ikwerre",
                    "Khana",
                    "Obio/Akpor",
                    "Ogba/Egbema/Ndoni",
                    "Ogu/Bolo",
                    "Okrika",
                    "Omuma",
                    "Opobo/Nkoro",
                    "Oyigbo",
                    "Port Harcourt",
                    "Tai"],
        "Sokoto": [
                    "Binji",
                    "Bodinga",
                    "Dange Shuni",
                    "Gada",
                    "Goronyo",
                    "Gudu",
                    "Gwadabawa",
                    "Illela",
                    "Isa",
                    "Kebbe",
                    "Kware",
                    "Rabah",
                    "Sabon Birni",
                    "Shagari",
                    "Silame",
                    "Sokoto North",
                    "Sokoto South",
                    "Tambuwal",
                    "Tangaza",
                    "Tureta",
                    "Wamako",
                    "Wurno",
                    "Yabo"],
        "Taraba": [
                    "Ardo Kola",
                    "Bali",
                    "Donga",
                    "Gashaka",
                    "Gassol",
                    "Ibi",
                    "Jalingo",
                    "Karim Lamido",
                    "Kumi",
                    "Lau",
                    "Sardauna",
                    "Takum",
                    "Ussa",
                    "Wukari",
                    "Yorro",
                    "Zing"
                ],
        "Yobe": [
                    "Bade",
                    "Bursari",
                    "Damaturu",
                    "Fika",
                    "Fune",
                    "Geidam",
                    "Gujba",
                    "Gulani",
                    "Jakusko",
                    "Karasuwa",
                    "Machina",
                    "Nangere",
                    "Nguru",
                    "Potiskum",
                    "Tarmuwa",
                    "Yunusari",
                    "Yusufari"
                ],
        "Zamfara": [
                    "Anka",
                    "Bakura",
                    "Birnin Magaji/Kiyaw",
                    "Bukkuyum",
                    "Bungudu",
                    "Chafe",
                    "Gummi",
                    "Gusau",
                    "Kaura Namoda",
                    "Maradun",
                    "Maru",
                    "Shinkafi",
                    "Talata Mafara",
                    "Zurmi"
                    ]
        }

    const multiselectIncomeValues = [
        { name: 'Salaries', code: 'Salaries' },
        { name: 'Pensions', code: 'Pensions' },
        { name: 'Agric. Production', code: 'Agric. Production' },
        { name: 'Small business', code: 'Small business' },
        { name: 'Remittances', code: 'Remittances' },
        { name: 'Government or other assistance', code: 'Government or other assistance' },
        { name: 'Others', code: 'Others' },
    ];

    const multiselectExpenseValues = [
        { name: 'Food', code: 'Food' },
        { name: 'Education', code: 'Education' },
        { name: 'Health', code: 'Health' },
        { name: 'Utilities(power, water)', code: 'Utilities(power, water)' },
        { name: 'Taxes', code: 'Taxes' },
        { name: 'Transport', code: 'Transport' },
        { name: 'Clothing', code: 'Clothing' },
        { name: 'Others', code: 'Others' },

    ];

    const itemTemplate = (option) => {
        return (
            <div className="country-item">
                {/* <span className={`flag flag-${option.code.toLowerCase()}`} /> */}
                <span>{option.name}</span>
            </div>
        );
    };

    const selectedItemTemplate = (option) => {
        if (option) {
            return (
                <div className="country-item country-item-value">
                    {/* <span className={`flag flag-${option.code.toLowerCase()}`} /> */}
                    <span>{option.name}</span>
                </div>
            );
        }

        return 'Select Sources';
    };

    if (auth.currentUser == null) { 
        return <Redirect to='/' />
    }

    //console.log('Date:-', moment("Mar 17, 1988").format('MM-DD-yyyy'))
    return (
        <>
            <div className="p-col-12 p-md-9">
                <div className="card">
                    <h5>AccordionPanel</h5>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="HouseHold Census Information">
                            <div className="p-col-12 p-md-12">
                                <div className="card p-fluid">
                                    <h5>Identification of Affected Person</h5>
                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="pap_name">Name</label>
                                            <InputText id="pap_name" type="text" value={pap ? pap.title : ''} onChange={(e) => onInputChange(e, 'title')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="pap_dob">Date Of Birth</label>
                                            <InputText id="pap_dob" type="date" value={moment(pap && pap.hhf.pap_dob).format('yyyy-MM-DD')} onChange={(e) => console.log('event...', e.timeStamp)}/>
                                            {/* <Calendar showIcon showButtonBar value="2015-06-22" onChange={(e) => setCalendarValue(e.value)}></Calendar> */}
                                        </div>
                                    </div>


                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12">
                                            <label htmlFor="address">Residential Address</label>
                                            <InputTextarea id="address" rows="1" value ={pap ? pap.hhf.pap_resident_address : ''} onChange={(e) => onInputChange_pap(e, 'pap_resident_address')} />
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="gender">Gender</label>
                                            <Dropdown id="gender" value={pap && {name: pap.hhf.pap_gender, code: pap.hhf.pap_gender }} onChange={(e) => onDropdownChange_pap(e, 'pap_gender')} options={dropdownGenders} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="maritalstatus">Marital Status</label>
                                            <Dropdown id="maritalstatus" value={pap && {name: pap.hhf.pap_marital_status, code: pap.hhf.pap_marital_status }} onChange={(e) => onDropdownChange_pap(e, 'pap_marital_status')} options={dropdownMaritalStatuses} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="phone1">Primary Phone Number</label>
                                            <InputText id="phone1" type="text" value={pap ? pap.hhf.pap_phone : ''} onChange={(e) => onInputChange_pap(e, 'pap_phone')} />
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="phone2">Secondary Phone Number</label>
                                            <InputText id="phone2" type="text" value={pap ? pap.hhf.pap_phone1 : ''} onChange={(e) => onInputChange_pap(e, 'pap_phone1')} />
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="edustatus">Educational Status</label>
                                            <Dropdown id="edustatus" value={pap && {name: pap.hhf.pap_educational, code: pap.hhf.pap_educational }} onChange={(e) => onDropdownChange_pap(e, 'pap_educational')} options={dropdownEduStatuses} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="hometown">Home Town</label>
                                            <InputText id="hometown" type="text" value={pap ? pap.hhf.pap_homeTown : ''} onChange={(e) => onInputChange_pap(e, 'pap_homeTown')} />
                                            
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="stateOfOrigin">State of Origin</label>
                                            <Dropdown id="stateOfOrigin" value={pap && {name: pap.hhf.pap_stateOfOrigin, code: pap.hhf.pap_stateOfOrigin }} onChange={(e) => onDropdownChange_pap(e, 'pap_stateOfOrigin')} options={dropdownStates} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="LGAOfOrigin">LGA of Origin</label>
                                            <Dropdown id="LGAOfOrigin" value={pap && {name: pap.hhf.pap_lgaOfOrigin, code: pap.hhf.pap_lgaOfOrigin }} onChange={(e) => onDropdownChange_pap(e, 'pap_lgaOfOrigin')} options={dropdownLGAsOrigin} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="religion">Religion</label>
                                            <Dropdown id="religion" value={pap && {name: pap.hhf.pap_religion, code: pap.hhf.pap_religion }} onChange={(e) => onDropdownChange_pap(e, 'pap_religion')} options={dropdownReligions} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="ethnicity">Ethnicity</label>
                                            <Dropdown id="ethnicity" value={pap && {name: pap.hhf.pap_ethnicity, code: pap.hhf.pap_ethnicity }} onChange={(e) => onDropdownChange_pap(e, 'pap_ethnicity')} options={dropdownEthnics} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="idtype">Identification Type</label>
                                            <Dropdown id="idtype" value={pap && {name: pap.hhf.pap_idType, code: pap.hhf.pap_idType }} onChange={(e) => onDropdownChange_pap(e, 'pap_idType')} options={dropdownIdType} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="idno">Identification Number</label>
                                            <InputText id="idno" type="text" value={pap ? pap.hhf.pap_idNumber : ''} onChange={(e) => onInputChange_pap(e, 'pap_idNumber')} />
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="idissuedate">ID Issue Date</label>
                                            <InputText id="idissuedate" type="date" value={pap ? pap.hhf.pap_idIssueDate : ''} onChange={(e) => onInputChange_pap(e, 'pap_idIssueDate')} />
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="resident">Is PAP resident in the property?</label>
                                            <Dropdown id="resident" value={pap && {name: pap.hhf.pap_resident_type, code: pap.hhf.pap_resident_type }} onChange={(e) => onDropdownChange_pap(e, 'pap_resident_type')} options={dropdownResType} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="prop_owner">Is PAP the property owner?</label>
                                            <Dropdown id="prop_owner" value={pap && {name: pap.hhf.pap_property_owner, code: pap.hhf.pap_property_owner }} onChange={(e) => onDropdownChange_pap(e, 'pap_property_owner')} options={dropdownPropOwner} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="gender">Is PAP the head of house?</label>
                                            <Dropdown id="gender" value={pap && {name: pap.hhf.pap_gender, code: pap.hhf.pap_gender }} onChange={(e) => onDropdownChange_pap(e, 'pap_gender')} options={isPAPHHH_dropdown} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-12">
                                <div className="card p-fluid">
                                    <h5>Identification of HouseHold Head</h5>
                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="hhhname">Name</label>
                                            <InputText id="hhhname" type="text" />
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="hhhgender">Gender</label>
                                            <Dropdown id="hhhgender" value={dropdownHHHGender} onChange={(e) => setDropdownHHHGender(e.value)} options={dropdownGenders} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="gender">Relationship with PAP?</label>
                                            <Dropdown id="gender" value={dropdownGender} onChange={(e) => setDropdownGender(e.value)} options={dropdownGenders} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-12">
                                <div className="card p-fluid">
                                    <h5>Identification of Property</h5>
                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="census_no">Census Number</label>
                                            <InputText id="census_no" type="text" value={pap ? pap.hhf.censusNo : ''} onChange={(e) => onInputChange_pap(e, 'censusNo')} />
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="proptype">Property Type</label>
                                            <Dropdown id="proptype" value={pap && {name: pap.hhf.prop_type, code: pap.hhf.prop_type }} onChange={(e) => onDropdownChange_pap(e, 'prop_type')} options={dropdownPropTypes} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12">
                                            <label htmlFor="address">Property Address</label>
                                            <InputTextarea id="prop_address" rows="1" value ={pap ? pap.address : ''} onChange={(e) => onInputChange(e, 'address')} />                  
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="community">Community</label>
                                            <InputText id="community" type="text" value ={pap ? pap.community : ''} onChange={(e) => onInputChange(e, 'community')} />
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="propstate">State</label>
                                            <Dropdown id="propstate" value={pap && {name: pap.state, code: pap.state }} onChange={(e) => onDropdownChange(e, 'state')} options={dropdownStates} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="proplga">LGA</label>
                                            <Dropdown id="proplga" value={pap && {name: pap.lga, code: pap.lga }} onChange={(e) => onDropdownChange(e, 'lga')} options={dropdownPAPLgas} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-12">
                                <div className="card p-fluid">
                                    <h5>Composition of household</h5>

                                    <div className="p-grid crud-demo">
                                        <div className="p-col-12">
                                            <div className="card">
                                                <Toast ref={toast} />
                                                <Toolbar className="p-mb-4" left={leftToolbarTemplate} ></Toolbar>

                                                <DataTable ref={dt} value={dependants} selection={selectedDependants} onSelectionChange={(e) => setSelectedDependants(e.value)}
                                                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} dependants"
                                                    globalFilter={globalFilter} emptyMessage="No dependants found." header={header}>
                                                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                                    {/* <Column field="code" header="Code" sortable body={codeBodyTemplate}></Column> */}
                                                    <Column field="dep_name" header="Name" sortable body={nameBodyTemplate}></Column>
                                                    {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                                                    <Column field="dep_gender" header="Gender" body={genderBodyTemplate} sortable></Column>
                                                    <Column field="relationship" header="Relationship" sortable body={relationshipBodyTemplate}></Column>
                                                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
                                                    <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable></Column> */}
                                                    <Column body={actionBodyTemplate}></Column>
                                                </DataTable>

                                                <Dialog visible={DependantDialog} style={{ width: '450px' }} header="Dependant Details" modal className="p-fluid" footer={DependantDialogFooter} onHide={hideDialog}>
                                                    {/* {dependant.image && <img src={`assets/demo/images/dependant/${dependant.image}`} alt={dependant.image} className="dependant-image" />} */}
                                                    <div className="p-field">
                                                        <label htmlFor="dep_name">Name</label>
                                                        <InputText id="dep_name" value={dependant.name} onChange={(e) => onInputChange_dep(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !dependant.name })} />
                                                        {submitted && !dependant.name && <small className="p-invalid">Name is required.</small>}
                                                    </div>

                                                    <div className="p-formgrid p-grid">

                                                        <div className="p-field p-col">
                                                            <label>Gender</label>                   
                                                            <Dropdown id="dep_gender" value={{ name: dependant.sex, code: dependant.sex }} onChange={(e) => onDropdownChange_dep(e, 'sex')} options={dropdownGenders} optionLabel="name" placeholder="Select One"></Dropdown>
                                                        </div>

                                                        <div className="p-field p-col">
                                                            <label htmlFor="dep_relate">Relationship</label>
                                                            <Dropdown id="dep_relate" value={{ name: dependant.relationship, code: dependant.relationship }} onChange={(e) => onDropdownChange_dep(e, 'relationship')} options={dropdownRelationship} optionLabel="name" placeholder="Select One"></Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="p-formgrid p-grid">
                                                        <div className="p-field p-col">
                                                            <label htmlFor="dep_dob">DOB</label>
                                                            <InputText id="dep_dob" value={dependant.dob} onChange={(e) => onInputChange_dep(e, 'dob')} required autoFocus className={classNames({ 'p-invalid': submitted && !dependant.dob })} type="date" />
                                                            {submitted && !dependant.dob && <small className="p-invalid">DOB is required.</small>}
                                                        </div>
                                                        <div className="p-field p-col">
                                                            <label htmlFor="dep_relate">Education</label>
                                                            <Dropdown id="dep_relate" value={{ name: dependant.education, code: dependant.education }} onChange={(e) =>  onDropdownChange_dep(e, 'education')} options={dropdownEducLevel} optionLabel="name" placeholder="Select One"></Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="p-formgrid p-grid">
                                                        <div className="p-field p-col">
                                                            <label htmlFor="dep_relate">Occupation</label>
                                                            <Dropdown id="dep_relate" value={{ name: dependant.ocupation, code: dependant.ocupation }} onChange={(e) =>  onDropdownChange_dep(e, 'ocupation')} options={dropdownOccupation} optionLabel="name" placeholder="Select One"></Dropdown>
                                                        </div>
                                                        <div className="p-field p-col">
                                                            <label htmlFor="dep_relate">Vulnerability</label>
                                                            <Dropdown id="dep_relate" value={{ name: dependant.vulnerability_issues, code: dependant.vulnerability_issues }} onChange={(e) =>  onDropdownChange_dep(e, 'vulnerability_issues')} options={dropdownVulnerability} optionLabel="name" placeholder="Select One"></Dropdown>
                                                        </div>
                                                    </div>

                                                    <div className="p-field">
                                                        <label htmlFor="dep_address">Address</label>
                                                        <InputTextarea id="dep_address" value={dependant.residence} onChange={(e) => onInputChange_dep(e, 'residence')} rows={1} cols={20} />
                                                    </div>
                                                </Dialog>

                                                <Dialog visible={deleteDependantDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDependantDialogFooter} onHide={hidedeleteDependantDialog}>
                                                    <div className="confirmation-content">
                                                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                                                        {dependant && <span>Are you sure you want to delete <b>{dependant.name}</b>?</span>}
                                                    </div>
                                                </Dialog>

                                                <Dialog visible={deleteDependantsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDependantsDialogFooter} onHide={hidedeleteDependantsDialog}>
                                                    <div className="confirmation-content">
                                                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                                                        {dependant && <span>Are you sure you want to delete the selected dependants?</span>}
                                                    </div>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-col-12 p-md-12">
                                <div className="card p-fluid">
                                    <h5>HouseHold Livelihood Information</h5>
                                    <div className="p-formgrid p-grid">

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="avg_income">Average Total Monthly Income</label>
                                            <Dropdown id="avg_income" value={pap && {name: pap.hhf.pap_monthly_income, code: pap.hhf.pap_monthly_income }} onChange={(e) => onDropdownChange_pap(e, 'pap_monthly_income')} options={dropdownAvgIncomes} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="income">Main sources of income</label>
                                            <MultiSelect 
                                                value = { 
                                                    pap && (() => { 
                                                        const newArray = [];
                                                        pap.hhf.pap_main_income.map((value) => {
                                                            newArray.push(
                                                                { name: value, code: value }
                                                            )
                                                        })
                                                        return newArray
                                                    })()
                                                }
                                                onChange={(e) => onMultiDropDownChange(e, 'pap_main_income')} 
                                                options={multiselectIncomeValues} optionLabel="name" placeholder="Select sources" filter
                                                itemTemplate={itemTemplate} selectedItemTemplate={selectedItemTemplate} className="multiselect-custom" />
                                        </div>

                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="expense">Main sources of expense</label>
                                            <MultiSelect 
                                                value = { 
                                                    pap && (() => { 
                                                        const newArray = [];
                                                        pap.hhf.pap_expense_source.map((value) => {
                                                            newArray.push(
                                                                { name: value, code: value }
                                                            )
                                                        })
                                                        return newArray
                                                    })()
                                                }
                                                onChange={(e) => onMultiDropDownChange(e, 'pap_expense_source')} 
                                                options={multiselectExpenseValues} optionLabel="name" placeholder="Select sources" filter
                                                itemTemplate={itemTemplate} selectedItemTemplate={selectedItemTemplate} className="multiselect-custom" />
    
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="food_need">Do you produce some of your food needs?</label>
                                            <div className="p-inputgroup">
                                                <span className="p-inputgroup-addon p-inputgroup-addon-checkbox">
                                                    <Checkbox checked={pap && pap.hhf.pap_food_needs} onChange={(e) => setInputGroupValue(e.checked)} binary />
                                                </span>
                                                <InputText id='food_need' type="text" value ={pap ? pap.hhf.pap_food_needs : ''} onChange={(e) => onInputChange_pap(e, 'pap_food_needs')} placeholder="Specify food(s) if yes" />
                                            </div>
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="food_prod">How significant is your food production?</label>
                                            <Dropdown id="food_prod" value={pap && {name: pap.hhf.pap_food_production, code: pap.hhf.pap_food_production }} onChange={(e) => onDropdownChange_pap(e, 'pap_food_production')} options={dropdownFoodProds} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="gender">Are there periods of time when it is really difficult to meet basic neeeds?</label>
                                            <div className="p-inputgroup">
                                                <span className="p-inputgroup-addon p-inputgroup-addon-checkbox">
                                                <Checkbox checked={pap && pap.hhf.pap_difficulty_food} onChange={(e) => setInputGroupValue(e.checked)} binary />
                                                </span>
                                                <InputText id='difficulty_food' type="text" value ={pap ? pap.hhf.pap_difficulty_food : ''} onChange={(e) => onInputChange_pap(e, 'pap_difficulty_food')} placeholder="Specify food(s) if yes" />

                                            </div>
                                        </div>
                                        <div className="p-field p-col-12 p-md-6">
                                            <label htmlFor="compensation">Compensation preferences</label>
                                            <Dropdown id="compensation" value={pap && {name: pap.hhf.pap_compensation_pref, code: pap.hhf.pap_compensation_pref }} onChange={(e) => onDropdownChange_pap(e, 'pap_compensation_pref')} options={dropdownCompensation} optionLabel="name" placeholder="Select One"></Dropdown>
                                        </div>
                                    </div>

                                    <div className="p-formgrid p-grid">
                                        <div className="p-field p-col-12">
                                            <label htmlFor="comment">Enumerator's Comments</label>
                                            <InputTextarea id='comment'  rows="1"  value ={pap ? pap.hhf.pap_enumerator_comment : ''} onChange={(e) => onInputChange_pap(e, 'pap_enumerator_comment')} />

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </AccordionTab>
                        <AccordionTab header="Plot Information">
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque
                            ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                            voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
                        </AccordionTab>
                        <AccordionTab header="Structure Information">
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
                            et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                            Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
                        quo minus.</p>
                        </AccordionTab>
                        <AccordionTab header="Business Information">
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
                            et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                            Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
                        quo minus.</p>
                        </AccordionTab>
                        <AccordionTab header="Livelihood Information">
                            <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
                            et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                            Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
                        quo minus.</p>
                        </AccordionTab>
                    </Accordion>
                </div>
            </div>

            <div className="p-col-12 p-md-3">
                Images here
       </div>
        </>
    );
}
