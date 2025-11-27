import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import pageStyles from '../../styles/PageStyles';
import sharedStyles, { colors, spacing, typography, borderRadius, shadows } from '../../styles/SharedStyles';
import { fornecedoresApi } from '../../services/api';
import useOfflineMode from '../../hooks/useOfflineMode';

const Fornecedor = () => {
    const [fornecedores, setFornecedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [pesquisa, setPesquisa] = useState('');
    const [form, setForm] = useState({
        nome: '',
        email: '',
        telefone: '',
        observacoes: '',
        ativo: true,
    });
    const offline = useOfflineMode();

    const carregar = useCallback(async () => {
        try {
            const data = await fornecedoresApi.list();
            setFornecedores(data);
        } catch (error) {
            console.error('[Fornecedor] list', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const fornecedoresFiltrados = useMemo(() => {
        if (!pesquisa.trim()) {
            return fornecedores;
        }

        const termoPesquisa = pesquisa.toLowerCase().trim();

        return fornecedores.filter((fornecedor) => {
            const nomeMatch = fornecedor.nome?.toLowerCase().includes(termoPesquisa);
            const emailMatch = fornecedor.email?.toLowerCase().includes(termoPesquisa);
            const telefoneMatch = fornecedor.telefone?.includes(termoPesquisa);
            const observacoesMatch = fornecedor.observacoes?.toLowerCase().includes(termoPesquisa);
            const idMatch = String(fornecedor.id).includes(termoPesquisa);
            const statusMatch = (fornecedor.ativo ? 'ativo' : 'inativo').includes(termoPesquisa);

            return nomeMatch || emailMatch || telefoneMatch || observacoesMatch || idMatch || statusMatch;
        });
    }, [fornecedores, pesquisa]);

    const atualizarCampo = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const limparFormulario = () =>
        setForm({
            nome: '',
            email: '',
            telefone: '',
            observacoes: '',
            ativo: true,
        });

    const abrirEdicao = (fornecedor) => {
        setEditingId(fornecedor.id);
        setForm({
            nome: fornecedor.nome || '',
            email: fornecedor.email || '',
            telefone: fornecedor.telefone || '',
            observacoes: fornecedor.observacoes || '',
            ativo: fornecedor.ativo !== false,
        });
        setModalVisible(true);
    };

    const fecharModal = () => {
        setModalVisible(false);
        setEditingId(null);
        limparFormulario();
    };

    const handleSalvar = async () => {
        if (!form.nome.trim()) {
            Alert.alert('Validação', 'Informe o nome do fornecedor.');
            return;
        }

        try {
            if (editingId) {
                await fornecedoresApi.update(editingId, form);
                Alert.alert('Sucesso', 'Fornecedor atualizado com sucesso!');
            } else {
                await fornecedoresApi.create(form);
                Alert.alert('Sucesso', 'Fornecedor cadastrado com sucesso!');
            }
            fecharModal();
            carregar();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o fornecedor.');
            console.error('[Fornecedor] save', error);
        }
    };

    const confirmarExclusao = (id) => {
        Alert.alert('Excluir fornecedor', 'Deseja remover este fornecedor?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await fornecedoresApi.remove(id);
                        carregar();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível excluir.');
                        console.error('[Fornecedor] delete', error);
                    }
                },
            },
        ]);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={sharedStyles.card} 
            onPress={() => abrirEdicao(item)}
            onLongPress={() => confirmarExclusao(item.id)}
        >
            <View style={sharedStyles.cardHeader}>
                <Text style={sharedStyles.cardTitle}>{item.nome}</Text>
                <View style={[sharedStyles.badge, { backgroundColor: item.ativo ? colors.success : colors.textTertiary, marginLeft: spacing.sm }]}>
                    <Text style={[sharedStyles.badgeText, { color: colors.textLight }]}>{item.ativo ? 'ATIVO' : 'INATIVO'}</Text>
                </View>
            </View>
            <Text style={{ color: colors.textSecondary, marginBottom: 2, fontSize: 14 }}>{item.email || 'Sem e-mail'}</Text>
            <Text style={{ color: colors.textSecondary, marginBottom: 2, fontSize: 14 }}>{item.telefone || 'Sem telefone'}</Text>
            {item.observacoes ? <Text style={{ marginTop: spacing.sm, color: colors.textSecondary, fontStyle: 'italic', fontSize: 13 }}>{item.observacoes}</Text> : null}
            <Text style={sharedStyles.cardHint}>Toque para editar • Segure para excluir</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[pageStyles.container, sharedStyles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={sharedStyles.loadingText}>Carregando fornecedores...</Text>
            </View>
        );
    }

    return (
        <View style={pageStyles.container}>
            <Text style={pageStyles.title}>Fornecedores</Text>

            {offline ? <Text style={sharedStyles.offline}>Modo offline: dados locais</Text> : null}

            {/* Campo de Pesquisa */}
            <View style={sharedStyles.searchContainer}>
                <TextInput
                    style={sharedStyles.searchInput}
                    placeholder="🔍 Pesquisar por nome, e-mail, telefone..."
                    placeholderTextColor={colors.textTertiary}
                    value={pesquisa}
                    onChangeText={setPesquisa}
                    clearButtonMode="while-editing"
                />
                {pesquisa.trim() && (
                    <Text style={sharedStyles.searchResults}>
                        {fornecedoresFiltrados.length} resultado(s) encontrado(s)
                    </Text>
                )}
            </View>

            <TouchableOpacity 
                style={sharedStyles.addButton} 
                onPress={() => {
                    limparFormulario();
                    setEditingId(null);
                    setModalVisible(true);
                }}
            >
                <Text style={sharedStyles.addButtonText}>+ Adicionar Fornecedor</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={fecharModal}
            >
                <View style={sharedStyles.modalOverlay}>
                    <View style={sharedStyles.modalContent}>
                        <View style={sharedStyles.modalHeader}>
                            <Text style={sharedStyles.modalTitle}>
                                {editingId ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                            </Text>
                            <TouchableOpacity onPress={fecharModal}>
                                <Text style={sharedStyles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={sharedStyles.modalForm}>
                            <TextInput
                                style={sharedStyles.modalInput}
                                placeholder="Nome *"
                                value={form.nome}
                                onChangeText={(text) => atualizarCampo('nome', text)}
                            />
                            <TextInput
                                style={sharedStyles.modalInput}
                                placeholder="E-mail"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={form.email}
                                onChangeText={(text) => atualizarCampo('email', text)}
                            />
                            <TextInput
                                style={sharedStyles.modalInput}
                                placeholder="Telefone"
                                keyboardType="phone-pad"
                                value={form.telefone}
                                onChangeText={(text) => atualizarCampo('telefone', text)}
                            />
                            <TextInput
                                style={[sharedStyles.modalInput, { height: 80, textAlignVertical: 'top' }]}
                                placeholder="Observações"
                                multiline
                                numberOfLines={3}
                                value={form.observacoes}
                                onChangeText={(text) => atualizarCampo('observacoes', text)}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                                <Text style={{ fontWeight: '600', color: colors.textPrimary }}>Ativo</Text>
                                <Switch value={form.ativo} onValueChange={(value) => atualizarCampo('ativo', value)} />
                            </View>
                            <TouchableOpacity style={sharedStyles.modalButton} onPress={handleSalvar}>
                                <Text style={sharedStyles.modalButtonText}>
                                    {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={sharedStyles.modalCancelButton} onPress={fecharModal}>
                                <Text style={sharedStyles.modalCancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={fornecedoresFiltrados}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: 16 }}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    carregar();
                }}
                ListEmptyComponent={
                    <View style={sharedStyles.emptyContainer}>
                        {pesquisa.trim() ? (
                            <>
                                <Text style={sharedStyles.emptyIcon}>🔍</Text>
                                <Text style={sharedStyles.emptyTitle}>Nenhum resultado encontrado</Text>
                                <Text style={sharedStyles.emptyText}>
                                    Não foi possível encontrar fornecedores que correspondam a "{pesquisa}".
                                </Text>
                                <Text style={sharedStyles.emptyHint}>
                                    Tente pesquisar por nome, e-mail, telefone ou observações.
                                </Text>
                            </>
                        ) : (
                            <Text style={sharedStyles.emptyText}>Cadastre fornecedores para começar.</Text>
                        )}
                    </View>
                }
            />
        </View>
    );
};

export default Fornecedor;

const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#0b3b60',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    form: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        elevation: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d5d5d5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    switchLabel: {
        fontWeight: '600',
        color: '#111827',
    },
    button: {
        backgroundColor: '#0b3b60',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d5d5d5',
    },
    cancelButtonText: {
        color: '#6b7280',
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginTop: 12,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0b3b60',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        marginLeft: 8,
    },
    badgeOn: {
        backgroundColor: '#059669',
    },
    badgeOff: {
        backgroundColor: '#9ca3af',
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 11,
    },
    cardText: {
        color: '#374151',
        marginBottom: 2,
        fontSize: 14,
    },
    cardObs: {
        marginTop: 6,
        color: '#6b7280',
        fontStyle: 'italic',
        fontSize: 13,
    },
    cardHint: {
        marginTop: 8,
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    empty: {
        textAlign: 'center',
        marginTop: 32,
        color: '#6b7280',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 8,
    },
    emptyHint: {
        fontSize: 12,
        color: '#9ca3af',
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center',
    },
    offline: {
        color: '#db8b0b',
        marginBottom: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
        paddingBottom: 32,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0b3b60',
    },
    modalClose: {
        fontSize: 24,
        color: '#6b7280',
        fontWeight: '300',
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#d5d5d5',
        color: '#111827',
    },
    searchResults: {
        marginTop: 8,
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },
});