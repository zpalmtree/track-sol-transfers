import React, { Dispatch, SetStateAction } from 'react';
import { LAMPORTS_PER_SOL, Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import * as _ from 'lodash';

import './App.css';

const RPC_URL = 'https://ssc-dao.genesysgo.net/';
const BATCH_SIZE = 20;

const StyledTableCell = withStyles((theme) => ({
    root: {
        color: 'white',
        fontSize: '20px',
        textTransform: 'none',
        fontFamily: 'Agenda-Bold, Arial, sans-serif',
    },
    head: {
        fontSize: '30px',
    },
    body: {
        fontSize: '26px',
    }
}))(TableCell);

const AddressTableCell = withStyles((theme) => ({
    root: {
        fontSize: '20px',
        fontFamily: 'monospace',
    }
}))(StyledTableCell)

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const useIconStyles = makeStyles({
    root: {
        color: 'white',
    }
});

interface IRow {
    expanded: boolean;
    total: number;
    transactions: string[];
    address: string;
}

interface IRowProps {
    handleExpand: (address: string) => void;
    row: IRow;
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTransaction(
    connection: Connection,
    signature: string,
    setLogMessage: Dispatch<SetStateAction<string>>,
    ownerAddress: PublicKey) {

    while (true) {
        try {
            const tx = await connection.getTransaction(signature, { commitment: 'confirmed' });

            if (!tx || !tx.meta) {
                return;
            }

            if (tx.meta.err) {
                return;
            }

            const keys = tx.transaction.message.accountKeys;

            const solBefore = tx.meta.preBalances;
            const solAfter = tx.meta.postBalances;

            const changes = [];

            if (keys.length !== 3 && keys[2] !== SystemProgram.programId) {
                return;
            }

            let i = 0;

            for (const key of keys) {
                const before = solBefore[i];
                const after = solAfter[i];

                i++;

                if (key.toString() === ownerAddress.toString()) {
                    continue;
                }
                
                if (before === after) {
                    continue;
                }

                const change = before - after;

                changes.push({
                    address: key.toString(),
                    change,
                    signature,
                });
            }

            return changes;
        } catch (err) {
            setLogMessage(`Error fetching transaction: ${(err as any).toString()}, retrying in 1 second...`);
            sleep(1000);
            continue;
        }
    }
}

function Row(props: IRowProps) {
    const {
        row,
        handleExpand,
    } = props;

    const classes = useRowStyles();
    const iconClasses = useIconStyles();

    return (
        <>
            <TableRow key={row.address} className={classes.root}>
                <StyledTableCell align="center">
                    <IconButton aria-label="expand row" size="small" onClick={() => handleExpand(row.address)}>
                        {row.expanded
                            ? <KeyboardArrowUpIcon className={iconClasses.root}/>
                            : <KeyboardArrowDownIcon className={iconClasses.root}/>}
                    </IconButton>
                </StyledTableCell>
                <AddressTableCell align="center">{row.address}</AddressTableCell>
                <StyledTableCell align="center" style={{ color: row.total > 0 ? 'white' : 'red' }}>
                    {`${(row.total / LAMPORTS_PER_SOL).toFixed(3)} SOL`}
                </StyledTableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={row.expanded} timeout="auto" unmountOnExit>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                            {row.transactions.map((tx) => (
                                <a href={`https://solscan.io/tx/${tx}`} style={{ color: 'white', fontFamily: 'monospace', marginTop: '5px', textDecoration: 'none' }}>
                                    {tx}
                                </a>
                            ))}
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

function App() {
    const [rpc, setRpc] = React.useState<string>(RPC_URL);
    const [address, setAddress] = React.useState<string>('');
    const [logMessage, setLogMessage] = React.useState<string>('');
    const [finding, setFinding] = React.useState<boolean>(false);
    const [transactions, setTransactions] = React.useState<any[]>([]);

    const cancel = React.useRef(false);

    function handleExpand(address: string) {
        const newTransactions = _.cloneDeep(transactions);

        for (const tx of newTransactions) {
            if (tx.address === address) {
                tx.expanded = !tx.expanded;
            }
        }

        setTransactions(newTransactions);
    }

    function handleRpcChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRpc(e.target.value);
    }

    function handleAddressChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAddress(e.target.value);
    }

    function handleToggleFind() {
        if (!address) {
            setLogMessage('No address given');
            return;
        }

        if (finding) {
            setLogMessage('Cancelled.');
        }

        setFinding((finding) => !finding);
    }

    async function findTransactions() {
        setTransactions([]);

        const connection = new Connection(rpc, {
            confirmTransactionInitialTimeout: 60 * 1000,
        });

        const pubKey = new PublicKey(address);

        let signatures: string[] = [];

        let beforeSignature = undefined;

        while (true) {
            if (cancel.current) {
                return;
            }

            try {
                const newSignatures = await connection.getConfirmedSignaturesForAddress2(pubKey, {
                    before: beforeSignature,
                });

                if (newSignatures.length === 0) {
                    setLogMessage(`Finished collecting ${signatures.length} signatures.`);
                    break;
                }

                signatures = signatures.concat(newSignatures.map((s) => s.signature));

                setLogMessage(`Collected ${signatures.length} signatures...`);

                /* Just so the log message actually gets written to the screen */
                await sleep(10);

                beforeSignature = signatures[signatures.length - 1];
            } catch (err) {
                setLogMessage(`Failed to collect signatures, retrying in 1 second...`);
                await sleep(1000);
                continue;
            }
        }

        const movementMap = new Map();

        for (let i = 0; i < signatures.length / BATCH_SIZE; i++) {
            if (cancel.current) {
                return;
            }

            const itemsRemaining = Math.min(BATCH_SIZE, signatures.length - i * BATCH_SIZE);
            
            const processing = [];

            for (let j = 0; j < itemsRemaining; j++) {
                const item = i * BATCH_SIZE + j;

                setLogMessage(`Collecting transaction ${item+1} of ${signatures.length}...`);

                /* Just so the log message actually gets written to the screen */
                await sleep(10);

                const sig = signatures[item];

                processing.push(getTransaction(connection, sig, setLogMessage, pubKey));
            }

            const results = await Promise.all(processing);

            for (const result of results) {
                if (!result) {
                    continue;
                }

                if (result.length === 0) {
                    continue;
                }

                for (const change of result) {
                    const addressData = movementMap.get(change.address) || {
                        total: 0,
                        transactions: [],
                        address: change.address,
                        expanded: false,
                    };

                    addressData.transactions.push(change.signature);
                    addressData.total += change.change;

                    movementMap.set(change.address, addressData);
                }
            }
        }

        const collated = [...movementMap.values()].sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

        setTransactions(collated);

        setLogMessage(`Finished fetching transactions.`);

        setFinding(false);
    }

    React.useEffect(() => {
        if (!finding) {
            cancel.current = true;
            return;
        }

        cancel.current = false;

        setLogMessage('Finding transactions...');

        findTransactions();
    }, [finding]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img
                src={`/rug-scene-investigation-logo.png`}
                style={{
                    width: '256px',
                }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ marginRight: '10px', fontSize: '26px', color: 'white', width: '120px', textTransform: 'uppercase' }}>
                    RPC URL
                </label>

                <input value={rpc} style={{ width: '600px', fontSize: '20px' }} onChange={handleRpcChange}>
                </input>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <label style={{ marginRight: '10px', fontSize: '26px', color: 'white', width: '120px', textTransform: 'uppercase' }}>
                    Address
                </label>

                <input value={address} style={{ width: '600px', fontSize: '20px' }} onChange={handleAddressChange}/>
            </div>

            <button
                style={{
                    width: '300px',
                    marginTop: '30px',
                    fontSize: '26px',
                    textTransform: 'uppercase',
                    color: 'white',
                    backgroundColor: '#a768fd',
                    border: 'none',
                    padding: '5px',
                    borderRadius: '5px'
                }}
                onClick={handleToggleFind}
            >
                {finding ? 'Cancel' : 'Find Transactions'}
            </button>

            <div style={{ width: '90%', marginTop: '40px' }}>
                <TableContainer component='div'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center" style={{ width: '200px' }}>
                                    Transactions
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    Address
                                </StyledTableCell>
                                <StyledTableCell align="center" style={{ width: '200px' }}>
                                    SOL Moved
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((row) => (
                                <Row
                                    row={row}
                                    handleExpand={handleExpand}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <span style={{ marginTop: '30px', fontSize: '30px', color: 'white', textTransform: 'uppercase', marginBottom: '20px' }}>
                {logMessage}
            </span>

            <span style={{ color: 'white', marginTop: '100px' }}>
                Powered by
            </span>
            <img
                src={`/genesysgologo.png`}
                style={{
                    width: '128px',
                    marginTop: '20px',
                }}
            />
        </div>
    );
}

export default App;
