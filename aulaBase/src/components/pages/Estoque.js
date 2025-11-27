import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import pageStyles from '../../styles/PageStyles';
import sharedStyles, { colors, spacing, typography, borderRadius, shadows } from '../../styles/SharedStyles';
import { estoqueApi, produtosApi } from '../../services/api';
import useOfflineMode from '../../hooks/useOfflineMode';

const statusConfig = {
    zerado: {
        label: 'ZERADO',
        color: '#6b7280',
        bgColor: '#f3f4f6',
        icon: '⚠️',
        borderColor: '#d1d5db',
    },
    critico: {
        label: 'CRÍTICO',
        color: '#dc2626',
        bgColor: '#fee2e2',
        icon: '🔴',
        borderColor: '#fca5a5',
    },
    atencao: {
        label: 'ATENÇÃO',
        color: '#d97706',
        bgColor: '#fef3c7',
        icon: '🟡',
        borderColor: '#fcd34d',
    },
    ok: {
        label: 'OK',
        color: '#059669',
        bgColor: '#d1fae5',
        icon: '✅',
        borderColor: '#6ee7b7',
    },
};

const Estoque = () => {
    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loadingProduto, setLoadingProduto] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        sku: '',
        valor: '',
        custo: '',
        estoque_minimo: '',
    });
    const offline = useOfflineMode();

    const carregar = useCallback(async () => {
        try {
            setErrorMessage('');
            const data = await estoqueApi.list();
            setItens(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('[Estoque] Erro ao carregar:', error);
            setErrorMessage('Falha ao carregar estoque. Verifique se o backend está ativo.');
            setItens([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const itensFiltrados = useMemo(() => {
        if (!pesquisa.trim()) {
            return itens;
        }

        const termoPesquisa = pesquisa.toLowerCase().trim();

        return itens.filter((item) => {
            const nomeMatch = item.nome?.toLowerCase().includes(termoPesquisa);
            const skuMatch = item.sku?.toLowerCase().includes(termoPesquisa);
            const idMatch = String(item.id).includes(termoPesquisa);
            const statusMatch = item.status?.toLowerCase().includes(termoPesquisa);

            return nomeMatch || skuMatch || idMatch || statusMatch;
        });
    }, [itens, pesquisa]);

    const estatisticas = useMemo(() => {
        const total = itensFiltrados.length;
        const zerados = itensFiltrados.filter((item) => item.status === 'zerado').length;
        const criticos = itensFiltrados.filter((item) => item.status === 'critico').length;
        const atencao = itensFiltrados.filter((item) => item.status === 'atencao').length;
        const ok = itensFiltrados.filter((item) => item.status === 'ok').length;
        const abaixoMinimo = itensFiltrados.filter(
            (item) => item.quantidade_total <= item.estoque_minimo && item.quantidade_total > 0
        ).length;

        return { total, zerados, criticos, atencao, ok, abaixoMinimo };
    }, [itensFiltrados]);

    const getStatusConfig = (status) => {
        return statusConfig[status] || statusConfig.ok;
    };

    const abrirEdicao = async (item) => {
        try {
            setLoadingProduto(true);
            setEditingId(item.id);
            const produto = await produtosApi.get(item.id);
            if (!produto) {
                Alert.alert('Erro', 'Produto não encontrado.');
                setLoadingProduto(false);
                return;
            }
            setForm({
                nome: produto.nome || '',
                sku: produto.sku || '',
                valor: produto.valor?.toString() || '0',
                custo: produto.custo?.toString() || '0',
                estoque_minimo: produto.estoque_minimo?.toString() || '0',
            });
            setModalVisible(true);
        } catch (error) {
            console.error('[Estoque] Erro ao buscar produto:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do produto.');
        } finally {
            setLoadingProduto(false);
        }
    };

    const fecharModal = () => {
        setModalVisible(false);
        setEditingId(null);
        setForm({
            nome: '',
            sku: '',
            valor: '',
            custo: '',
            estoque_minimo: '',
        });
    };

    const atualizarCampo = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSalvar = async () => {
        if (!form.nome.trim()) {
            Alert.alert('Validação', 'O nome do produto é obrigatório.');
            return;
        }

        try {
            await produtosApi.update(editingId, {
                nome: form.nome.trim(),
                sku: form.sku?.trim() || null,
                valor: Number(form.valor) || 0,
                custo: Number(form.custo) || 0,
                estoque_minimo: Number(form.estoque_minimo) || 0,
            });
            
            Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
            fecharModal();
            carregar();
        } catch (error) {
            console.error('[Estoque] Erro ao atualizar:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o produto.');
        }
    };

    const confirmarExclusao = (id, nome) => {
        Alert.alert(
            'Excluir Produto',
            `Deseja realmente excluir o produto "${nome}"?\n\nEsta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await produtosApi.remove(id);
                            Alert.alert('Sucesso', 'Produto excluído com sucesso!');
                            carregar();
                        } catch (error) {
                            console.error('[Estoque] Erro ao excluir:', error);
                            Alert.alert('Erro', 'Não foi possível excluir o produto.');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        const status = getStatusConfig(item.status);
        const estaAbaixoMinimo = item.quantidade_total <= item.estoque_minimo;
        const mostraAlerta = estaAbaixoMinimo && item.quantidade_total > 0;

        return (
            <TouchableOpacity
                style={[styles.produtoCard, { borderLeftColor: status.borderColor, borderLeftWidth: 4 }]}
                onPress={() => abrirEdicao(item)}
                onLongPress={() => confirmarExclusao(item.id, item.nome)}
                activeOpacity={0.7}
            >
                {/* Header do Card */}
                <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                        <View style={styles.idContainer}>
                            <Text style={styles.idLabel}>ID</Text>
                            <Text style={styles.idValue}>{item.id}</Text>
                        </View>
                        <View style={styles.nomeContainer}>
                            <Text style={styles.produtoNome}>{item.nome}</Text>
                            {item.sku && <Text style={styles.produtoSku}>SKU: {item.sku}</Text>}
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                        <Text style={styles.statusIcon}>{status.icon}</Text>
                        <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
                    </View>
                </View>

                {/* Informações de Estoque */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Quantidade Atual</Text>
                        <Text style={[styles.infoValue, estaAbaixoMinimo && styles.valueDanger]}>
                            {item.quantidade_total} {item.quantidade_total === 1 ? 'unidade' : 'unidades'}
                        </Text>
                    </View>
                    {item.estoque_minimo > 0 && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Estoque Mínimo</Text>
                            <Text style={styles.infoValue}>{item.estoque_minimo} unidades</Text>
                        </View>
                    )}
                    {item.saldo_sobre_minimo !== undefined && item.saldo_sobre_minimo >= 0 && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Saldo sobre Mínimo</Text>
                            <Text style={[styles.infoValue, item.saldo_sobre_minimo === 0 && styles.valueWarning]}>
                                {item.saldo_sobre_minimo} unidades
                            </Text>
                        </View>
                    )}
                    {item.valor && item.valor > 0 && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Preço de Venda (Unit.)</Text>
                            <Text style={[styles.infoValue, styles.valueSuccess]}>
                                {item.valor.toLocaleString('pt-BR', { 
                                    style: 'currency', 
                                    currency: 'BRL',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                })}
                            </Text>
                        </View>
                    )}
                    {item.custo && item.custo > 0 && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Custo Unitário</Text>
                            <Text style={styles.infoValue}>
                                {item.custo.toLocaleString('pt-BR', { 
                                    style: 'currency', 
                                    currency: 'BRL',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                })}
                            </Text>
                        </View>
                    )}
                    {item.valor && item.custo && item.valor > 0 && item.custo > 0 && (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Lucro por Unidade</Text>
                                <Text style={[styles.infoValue, item.valor > item.custo ? styles.valueSuccess : styles.valueDanger]}>
                                    {(item.valor - item.custo).toLocaleString('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2 
                                    })}
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Margem de Lucro</Text>
                                <Text style={[styles.infoValue, item.valor > item.custo ? styles.valueSuccess : styles.valueDanger, styles.margemLucro]}>
                                    {(() => {
                                        const margem = ((item.valor - item.custo) / item.valor) * 100;
                                        return `${margem.toFixed(2)}%`;
                                    })()}
                                </Text>
                            </View>
                        </>
                    )}
                    {item.valor && item.valor > 0 && item.quantidade_total > 0 && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Valor Total em Estoque</Text>
                            <Text style={[styles.infoValue, styles.valueSuccess, styles.valueTotal]}>
                                {(item.valor * item.quantidade_total).toLocaleString('pt-BR', { 
                                    style: 'currency', 
                                    currency: 'BRL',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2 
                                })}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Alerta de Estoque Mínimo */}
                {mostraAlerta && (
                    <View style={styles.alertContainer}>
                        <Text style={styles.alertIcon}>⚠️</Text>
                        <Text style={styles.alertText}>
                            Estoque abaixo do mínimo! Necessário repor {item.estoque_minimo - item.quantidade_total} unidades.
                        </Text>
                    </View>
                )}

                {item.quantidade_total === 0 && (
                    <View style={styles.alertContainer}>
                        <Text style={styles.alertIcon}>🔴</Text>
                        <Text style={styles.alertText}>Produto sem estoque. Faça uma entrada de estoque.</Text>
                    </View>
                )}

                <Text style={styles.cardHint}>Toque para editar • Segure para excluir</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={[pageStyles.container, sharedStyles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={sharedStyles.loadingText}>Carregando estoque...</Text>
            </View>
        );
    }

    return (
        <View style={pageStyles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
            <Text style={pageStyles.title}>Estoque</Text>
                {offline && (
                    <View style={sharedStyles.offlineBadge}>
                        <Text style={sharedStyles.offlineText}>⚡ Offline</Text>
                    </View>
                )}
            </View>

            {errorMessage && (
                <View style={sharedStyles.errorContainer}>
                    <Text style={sharedStyles.errorIcon}>❌</Text>
                    <Text style={sharedStyles.errorText}>{errorMessage}</Text>
                </View>
            )}

            {/* Campo de Pesquisa */}
            <View style={sharedStyles.searchContainer}>
                <TextInput
                    style={sharedStyles.searchInput}
                    placeholder="🔍 Pesquisar por nome, SKU, ID ou status..."
                    placeholderTextColor={colors.textTertiary}
                    value={pesquisa}
                    onChangeText={setPesquisa}
                    clearButtonMode="while-editing"
                />
                {pesquisa.trim() && (
                    <Text style={sharedStyles.searchResults}>
                        {itensFiltrados.length} resultado(s) encontrado(s)
                    </Text>
                )}
            </View>

            {/* Estatísticas Resumidas */}
            {itensFiltrados.length > 0 && (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.statsContainer}
                    contentContainerStyle={{ paddingRight: 12 }}
                >
                    <View style={[styles.statCard, { backgroundColor: '#eff6ff', borderColor: '#3b82f6' }]}>
                        <Text style={[styles.statValue, { color: '#1e40af' }]} numberOfLines={1} adjustsFontSizeToFit>
                            {estatisticas.total}
                        </Text>
                        <Text style={styles.statLabel} numberOfLines={2}>Total</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#d1fae5', borderColor: '#10b981' }]}>
                        <Text style={[styles.statValue, { color: '#047857' }]} numberOfLines={1} adjustsFontSizeToFit>
                            {estatisticas.ok}
                        </Text>
                        <Text style={styles.statLabel} numberOfLines={2}>OK</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#fef3c7', borderColor: '#f59e0b' }]}>
                        <Text style={[styles.statValue, { color: '#b45309' }]} numberOfLines={1} adjustsFontSizeToFit>
                            {estatisticas.atencao}
                        </Text>
                        <Text style={styles.statLabel} numberOfLines={2}>Atenção</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#fee2e2', borderColor: '#ef4444' }]}>
                        <Text style={[styles.statValue, { color: '#b91c1c' }]} numberOfLines={1} adjustsFontSizeToFit>
                            {estatisticas.criticos}
                        </Text>
                        <Text style={styles.statLabel} numberOfLines={2}>Crítico</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#f3f4f6', borderColor: '#6b7280' }]}>
                        <Text style={[styles.statValue, { color: '#374151' }]} numberOfLines={1} adjustsFontSizeToFit>
                            {estatisticas.zerados}
                        </Text>
                        <Text style={styles.statLabel} numberOfLines={2}>Zerado</Text>
                    </View>
                    {estatisticas.abaixoMinimo > 0 && (
                        <View style={[styles.statCard, { backgroundColor: '#fef2f2', borderColor: '#dc2626' }]}>
                            <Text style={[styles.statValue, { color: '#991b1b' }]} numberOfLines={1} adjustsFontSizeToFit>
                                {estatisticas.abaixoMinimo}
                            </Text>
                            <Text style={styles.statLabel} numberOfLines={2}>Abaixo Mín.</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Lista de Produtos */}
            <FlatList
                data={itensFiltrados}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            carregar();
                        }}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={sharedStyles.emptyContainer}>
                        {pesquisa.trim() ? (
                            <>
                                <Text style={sharedStyles.emptyIcon}>🔍</Text>
                                <Text style={sharedStyles.emptyTitle}>Nenhum resultado encontrado</Text>
                                <Text style={sharedStyles.emptyText}>
                                    Não foi possível encontrar produtos que correspondam a "{pesquisa}".
                                </Text>
                                <Text style={sharedStyles.emptyHint}>
                                    Tente pesquisar por nome, SKU, ID ou status do produto.
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={sharedStyles.emptyIcon}>📦</Text>
                                <Text style={sharedStyles.emptyTitle}>Nenhum produto no estoque</Text>
                                <Text style={sharedStyles.emptyText}>
                                    Cadastre produtos na tela "Produtos" e adicione movimentações para visualizar o estoque aqui.
                                </Text>
                                {offline && (
                                    <Text style={sharedStyles.emptyHint}>Modo offline ativo - usando dados locais</Text>
                                )}
                            </>
                        )}
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />

            {/* Modal de Edição */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={fecharModal}
            >
                <View style={sharedStyles.modalOverlay}>
                    <View style={sharedStyles.modalContent}>
                        <View style={sharedStyles.modalHeader}>
                            <Text style={sharedStyles.modalTitle}>Editar Produto</Text>
                            <TouchableOpacity onPress={fecharModal}>
                                <Text style={sharedStyles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {loadingProduto ? (
                            <View style={sharedStyles.modalLoading}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={sharedStyles.modalLoadingText}>Carregando...</Text>
                            </View>
                        ) : (
                            <ScrollView 
                                style={sharedStyles.modalScrollView} 
                                contentContainerStyle={{ paddingBottom: spacing.xxxl }}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={sharedStyles.modalForm}>
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="Nome do produto *"
                                        value={form.nome}
                                        onChangeText={(text) => atualizarCampo('nome', text)}
                                    />
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="SKU"
                                        value={form.sku}
                                        onChangeText={(text) => atualizarCampo('sku', text)}
                                    />
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="Preço de Venda (R$)"
                                        value={form.valor}
                                        onChangeText={(text) => atualizarCampo('valor', text.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                                        keyboardType="decimal-pad"
                                    />
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="Custo Unitário (R$)"
                                        value={form.custo}
                                        onChangeText={(text) => atualizarCampo('custo', text.replace(/[^0-9.,]/g, '').replace(',', '.'))}
                                        keyboardType="decimal-pad"
                                    />
                                    {(() => {
                                        const valorNum = Number(form.valor) || 0;
                                        const custoNum = Number(form.custo) || 0;
                                        const margem = valorNum > 0 && custoNum > 0 
                                            ? ((valorNum - custoNum) / valorNum) * 100 
                                            : null;
                                        const lucro = valorNum - custoNum;
                                        return valorNum > 0 && custoNum > 0 ? (
                                            <View style={sharedStyles.infoBox}>
                                                <Text style={sharedStyles.infoBoxLabel}>💰 Margem de Lucro:</Text>
                                                <Text style={[sharedStyles.infoBoxValue, margem > 0 ? sharedStyles.valueSuccess : sharedStyles.valueDanger]}>
                                                    {margem.toFixed(2)}% ({lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 })} por unidade)
                                                </Text>
                                            </View>
                                        ) : valorNum > 0 || custoNum > 0 ? (
                                            <Text style={sharedStyles.modalInfo}>
                                                💡 Preencha o preço de venda e o custo para calcular a margem de lucro.
                                            </Text>
                                        ) : null;
                                    })()}
                                    <TextInput
                                        style={sharedStyles.modalInput}
                                        placeholder="Estoque Mínimo (unidades)"
                                        value={form.estoque_minimo}
                                        onChangeText={(text) => atualizarCampo('estoque_minimo', text.replace(/[^0-9]/g, ''))}
                                        keyboardType="numeric"
                                    />
                                    <Text style={sharedStyles.modalInfo}>
                                        💡 A quantidade atual deve ser alterada através de movimentações na tela "Movimentações".
                                    </Text>
                                    <TouchableOpacity style={sharedStyles.modalButton} onPress={handleSalvar}>
                                        <Text style={sharedStyles.modalButtonText}>Salvar Alterações</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={sharedStyles.modalCancelButton} onPress={fecharModal}>
                                        <Text style={sharedStyles.modalCancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Estoque;

const styles = StyleSheet.create({
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
        fontSize: 14,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    offlineBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fbbf24',
    },
    offlineText: {
        color: '#92400e',
        fontSize: 12,
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        backgroundColor: '#fee2e2',
        borderLeftWidth: 4,
        borderLeftColor: '#dc2626',
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    errorText: {
        flex: 1,
        color: '#991b1b',
        fontSize: 14,
        fontWeight: '500',
    },
    statsContainer: {
        marginBottom: 16,
        paddingVertical: 8,
    },
    statCard: {
        width: 100,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 12,
        marginRight: 12,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    statValue: {
        fontSize: 50,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: '#475569',
        fontWeight: '600',
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 0.3,
        lineHeight: 12,
    },
    listContainer: {
        paddingBottom: 32,
    },
    produtoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardHeaderLeft: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 12,
    },
    idContainer: {
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 45,
    },
    idLabel: {
        fontSize: 9,
        color: '#6b7280',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    idValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 2,
    },
    nomeContainer: {
        flex: 1,
    },
    produtoNome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0b3b60',
        marginBottom: 4,
    },
    produtoSku: {
        fontSize: 13,
        color: '#6b7280',
        fontFamily: 'monospace',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    statusIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    statusLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    infoContainer: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    valueDanger: {
        color: '#dc2626',
    },
    valueWarning: {
        color: '#d97706',
    },
    valueSuccess: {
        color: '#059669',
    },
    valueTotal: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    margemLucro: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    alertContainer: {
        flexDirection: 'row',
        backgroundColor: '#fef2f2',
        borderLeftWidth: 3,
        borderLeftColor: '#dc2626',
        padding: 12,
        borderRadius: 6,
        alignItems: 'flex-start',
    },
    alertIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    alertText: {
        flex: 1,
        fontSize: 13,
        color: '#991b1b',
        fontWeight: '500',
        lineHeight: 18,
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
    cardHint: {
        marginTop: 12,
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
        textAlign: 'center',
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
        width: '100%',
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
    modalLoading: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalLoadingText: {
        marginTop: 16,
        color: '#6b7280',
        fontSize: 14,
    },
    modalScrollView: {
        maxHeight: 500,
    },
    modalScrollContent: {
        paddingBottom: 32,
    },
    modalForm: {
        padding: 16,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#d5d5d5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        fontSize: 15,
        color: '#111827',
    },
    modalButton: {
        backgroundColor: '#0b3b60',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    modalCancelButton: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d5d5d5',
    },
    modalCancelButtonText: {
        color: '#6b7280',
        fontWeight: '600',
        fontSize: 16,
    },
    modalInfo: {
        fontSize: 12,
        color: '#6b7280',
        fontStyle: 'italic',
        marginTop: -8,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    margemPreview: {
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#bae6fd',
    },
    margemPreviewLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0369a1',
        marginBottom: 4,
    },
    margemPreviewValue: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});