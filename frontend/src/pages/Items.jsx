import { useEffect, useMemo, useState } from "react";
import { Box, Paper, Typography, Stack, TextField, Button, Grid, Card, CardContent, CardActions, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "../api.js";

export default function Items() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", description: "" });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "" });

    const fetchItems = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/items");
            setItems(res.data.items || []);
        } catch (e) {
            console.error(e);
            setError("Failed to load items.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const onCreate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post("/items", form);
            setItems((prev) => [res.data, ...prev]);
            setForm({ title: "", description: "" });
        } catch (e) {
            console.error(e);
            setError("Failed to create item.");
        }
    };

    const onDelete = async (id) => {
        try {
            await api.delete(`/items/${id}`);
            setItems((prev) => prev.filter((i) => i.id !== id));
        } catch (e) {
            console.error(e);
            setError("Failed to delete.");
        }
    };

    const onStartEdit = (item) => {
        setEditingId(item.id);
        setEditForm({ title: item.title, description: item.description || "" });
    };

    const onCancelEdit = () => {
        setEditingId(null);
        setEditForm({ title: "", description: "" });
    };

    const onSaveEdit = async (id) => {
        try {
            const res = await api.put(`/items/${id}`, editForm);
            setItems((prev) => prev.map((i) => (i.id === id ? res.data : i)));
            onCancelEdit();
        } catch (e) {
            console.error(e);
            setError("Failed to update item.");
        }
    };

    const gridCols = useMemo(() => ({
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
        xl: 3
    }), []);

    return (
        <Stack spacing={3}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Create Item</Typography>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} component="form" onSubmit={onCreate}>
                    <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth />
                    <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 160 } }}
                    >
                        Create
                    </Button>
                </Stack>
                {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
            </Paper>

            <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>Items</Typography>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {items.map((item) => (
                            <Grid item key={item.id} {...gridCols}>
                                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        {editingId === item.id ? (
                                            <Stack spacing={1}>
                                                <TextField label="Title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                                                <TextField label="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} multiline rows={3} />
                                            </Stack>
                                        ) : (
                                            <>
                                                <Typography variant="h6">{item.title}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{item.description}</Typography>
                                            </>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: "space-between", padding: '16px' }}>
                                        {editingId === item.id ? (
                                            <div style={{ minWidth: '88px' }}>
                                                <IconButton color="primary" onClick={() => onSaveEdit(item.id)}><SaveIcon /></IconButton>
                                                <IconButton color="error" onClick={onCancelEdit}><CancelIcon /></IconButton>
                                            </div>
                                        ) : (
                                            <div style={{ minWidth: '88px' }}>
                                                <IconButton color="primary" onClick={() => onStartEdit(item)}><EditIcon /></IconButton>
                                                <IconButton color="error" onClick={() => onDelete(item.id)}><DeleteIcon /></IconButton>
                                            </div>
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            Updated: {new Date(item.updatedAt || item.createdAt).toLocaleString()}
                                        </Typography>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Stack>
    );
}


