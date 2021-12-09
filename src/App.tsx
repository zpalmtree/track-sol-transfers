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
import GenesysGoLogo from './img/genesysgologo.png';
import RugSceneInvestigationLogo from './img/rug-scene-investigation-logo.png';

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

interface Transaction {
    amount: number;
    signature: string;
}

interface IRow {
    expanded: boolean;
    total: number;
    transactions: Transaction[];
    address: string;
}

interface IRowProps {
    handleExpand: (address: string) => void;
    row: IRow;
    target: string;
}

interface IAmountProps {
    amount: number;
}

interface ITransactionProps {
    address: string;
    tx: Transaction;
    target: string;
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

                const change = after - before;

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

function formatAddress(address: string) {
    return address.substr(0, 4) + '..' + address.substr(address.length - 4);
}

function formatSOL(amount: number) {
    return (amount / LAMPORTS_PER_SOL).toFixed(2);
}

function Amount(props: IAmountProps) {
    const {
        amount,
    } = props;

    return (
        <StyledTableCell align="center" style={{ color: amount > 0 ? '#4BB543' : 'red' }}>
            {`${formatSOL(amount)} SOL`}
        </StyledTableCell>
    );
}

function Transaction(props: ITransactionProps) {
    const {
        tx,
        target,
        address,
    } = props;

    const sender = tx.amount > 0 ? target : address;
    const receiver = tx.amount > 0 ? address : target;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
            <span style={{ color: 'white', fontFamily: 'monospace', marginRight: '10px' }}>
                {`${formatAddress(sender)} → ${formatAddress(receiver)}`}
            </span>

            <a href={`https://solscan.io/tx/${tx.signature}`} style={{ color: 'white', fontFamily: 'monospace', marginTop: '5px', textDecoration: 'none' }}>
                {tx.signature}
            </a>

            <span style={{ fontFamily: 'monospace', marginRight: '10px', color: tx.amount > 0 ? '#4BB543' : 'red' }}>
                {`${formatSOL(tx.amount)} SOL`}
            </span>

        </div>
    );
}

function Row(props: IRowProps) {
    const {
        row,
        handleExpand,
        target,
    } = props;

    const classes = useRowStyles();
    const iconClasses = useIconStyles();

    return (
        <>
            <TableRow key={row.address} className={classes.root}>
                <StyledTableCell align="center">
                    <IconButton aria-label="expand row" size="small" onClick={() => handleExpand(row.address)}>
                        <span style={{ color: 'white', fontSize: '20px', marginRight: '5px' }}>
                            {row.expanded ? 'Collapse' : 'Expand' }
                        </span>
                        {row.expanded
                            ? <KeyboardArrowUpIcon className={iconClasses.root}/>
                            : <KeyboardArrowDownIcon className={iconClasses.root}/>}
                    </IconButton>
                </StyledTableCell>
                <AddressTableCell align="center">{row.address}</AddressTableCell>
                <Amount amount={row.total}/>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={row.expanded} timeout="auto" unmountOnExit>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                            {row.transactions.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)).map((tx) => (
                                <Transaction
                                    tx={tx}
                                    target={target}
                                    address={row.address}
                                />
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
    const [transactions, setTransactions] = React.useState<IRow[]>([]);

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

                    addressData.transactions.push({
                        signature: change.signature,
                        amount: change.change,
                    });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [finding]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <img
                alt='rug-scene-logo'
                src={RugSceneInvestigationLogo}
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
                                <StyledTableCell align="center" style={{ width: '300px' }}>
                                    Transactions
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    Address
                                </StyledTableCell>
                                <StyledTableCell align="center" style={{ width: '300px' }}>
                                    Address Gained/Lost
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((row) => (
                                <Row
                                    row={row}
                                    target={address}
                                    handleExpand={handleExpand}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <span style={{ marginTop: '30px', fontSize: '30px', color: 'white', marginBottom: '20px' }}>
                {logMessage}
            </span>

            <span style={{ color: 'white', marginTop: '100px' }}>
                Powered by
            </span>
            <img
                alt='genesysgo-logo'
                src={GenesysGoLogo}
                style={{
                    width: '128px',
                    marginTop: '20px',
                    marginBottom: '40px',
                }}
            />
        </div>
    );
}

export default App;
