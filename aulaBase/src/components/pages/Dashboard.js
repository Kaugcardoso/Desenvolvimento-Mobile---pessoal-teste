import React, { useCallback, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    RefreshControl, 
    ActivityIndicator,
    StyleSheet 
} from 'react-native';
import pageStyles from '../../styles/PageStyles';
import sharedStyles, { colors, spacing, typography, borderRadius, shadows } from '../../styles/SharedStyles';
import dashStyles from '../../styles/DashboardStyles';
import { produtosApi, fornecedoresApi, movimentacoesApi, estoqueApi } from '../../services/api';
import useOfflineMode from '../../hooks/useOfflineMode';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dados, setDados] = useState({
        produtos: [],
        fornecedores: [],
        movimentacoes: [],
        estoque: [],
    });
    const offline = useOfflineMode();

    const carregarDados = useCallback(async () => {
        try {
            const [produtos, fornecedores, movimentacoes, estoque] = await Promise.all([
                produtosApi.list().catch(() => []),
                fornecedoresApi.list().catch(() => []),
                movimentacoesApi.list().catch(() => []),
                estoqueApi.list().catch(() => []),
            ]);

            setDados({
                produtos: Array.isArray(produtos) ? produtos : [],
                fornecedores: Array.isArray(fornecedores) ? fornecedores : [],
                movimentacoes: Array.isArray(movimentacoes) ? movimentacoes : [],
                estoque: Array.isArray(estoque) ? estoque : [],
            });
        } catch (error) {
            console.error('[Dashboard] Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

    const calcularEstatisticas = () => {
        const { produtos, fornecedores, movimentacoes, estoque } = dados;

        // Estoque
        const estoqueTotal = estoque.length;
        const estoqueCritico = estoque.filter((e) => e.status === 'critico' || e.status === 'zerado').length;
        const estoqueOk = estoque.filter((e) => e.status === 'ok').length;
        const totalUnidades = estoque.reduce((sum, e) => sum + (e.quantidade_total || 0), 0);

        // Produtos
        const produtosTotal = produtos.length;
        const produtosComValor = produtos.filter((p) => p.valor && p.valor > 0).length;
        const valorTotalEstoque = produtos.reduce((sum, p) => {
            const qtd = p.quantidade_total || 0;
            const valor = p.valor || 0;
            return sum + (qtd * valor);
        }, 0);

        // Fornecedores
        const fornecedoresTotal = fornecedores.length;
        const fornecedoresAtivos = fornecedores.filter((f) => f.ativo !== false).length;
        const fornecedoresInativos = fornecedoresTotal - fornecedoresAtivos;

        // Movimentações
        const movimentacoesTotal = movimentacoes.length;
        const ultimasMovimentacoes = movimentacoes.slice(0, 5);
        const entradasTotal = movimentacoes.filter((m) => m.tipo === 'entrada').reduce((sum, m) => sum + (m.quantidade || 0), 0);
        const saidasTotal = movimentacoes.filter((m) => m.tipo === 'saida').reduce((sum, m) => sum + (m.quantidade || 0), 0);

        return {
            estoque: { total: estoqueTotal, critico: estoqueCritico, ok: estoqueOk, totalUnidades },
            produtos: { total: produtosTotal, comValor: produtosComValor, valorTotal: valorTotalEstoque },
            fornecedores: { total: fornecedoresTotal, ativos: fornecedoresAtivos, inativos: fornecedoresInativos },
            movimentacoes: { total: movimentacoesTotal, entradas: entradasTotal, saidas: saidasTotal, ultimas: ultimasMovimentacoes },
        };
    };

    const stats = calcularEstatisticas();

    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        });
    };

    if (loading) {
        return (
            <View style={[pageStyles.container, sharedStyles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={sharedStyles.loadingText}>Carregando dashboard...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            carregarDados();
                        }}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
            <View style={dashStyles.banner}>
                <Text style={dashStyles.bannerText}>Bem Vindo ao Estoque JJK!</Text>
            </View>

            <View style={dashStyles.separator} />

            {offline && (
                <View style={sharedStyles.offlineBadge}>
                    <Text style={sharedStyles.offlineText}>⚡ Modo offline - dados locais</Text>
                </View>
            )}

            {/* Resumo de Estoque */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>📋 Estoque</Text>
                    <Text style={styles.cardSubtitle}>Status do estoque</Text>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.estoque.total}</Text>
                        <Text style={styles.statLabel}>Produtos</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, styles.statValueDanger]}>{stats.estoque.critico}</Text>
                        <Text style={styles.statLabel}>Críticos</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, styles.statValueSuccess]}>{stats.estoque.ok}</Text>
                        <Text style={styles.statLabel}>OK</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.estoque.totalUnidades}</Text>
                        <Text style={styles.statLabel}>Total Unidades</Text>
                    </View>
                </View>
                {stats.estoque.critico > 0 && (
                    <View style={styles.alertBox}>
                        <Text style={styles.alertText}>
                            ⚠️ {stats.estoque.critico} produto(s) com estoque crítico ou zerado
                        </Text>
                    </View>
                )}
            </View>

            {/* Resumo de Produtos */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>📦 Produtos</Text>
                    <Text style={styles.cardSubtitle}>Produtos cadastrados</Text>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.produtos.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.produtos.comValor}</Text>
                        <Text style={styles.statLabel}>Com Valor</Text>
                    </View>
                    <View style={[styles.statBox, styles.statBoxFull]}>
                        <Text style={styles.statValue}>
                            {formatarMoeda(stats.produtos.valorTotal)}
                        </Text>
                        <Text style={styles.statLabel}>Valor Total em Estoque</Text>
                    </View>
                </View>
            </View>

            {/* Resumo de Fornecedores */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>🏢 Fornecedores</Text>
                    <Text style={styles.cardSubtitle}>Fornecedores cadastrados</Text>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.fornecedores.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, styles.statValueSuccess]}>{stats.fornecedores.ativos}</Text>
                        <Text style={styles.statLabel}>Ativos</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, styles.statValueWarning]}>{stats.fornecedores.inativos}</Text>
                        <Text style={styles.statLabel}>Inativos</Text>
                    </View>
                </View>
            </View>

            {/* Resumo de Movimentações */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>🔄 Movimentações</Text>
                    <Text style={styles.cardSubtitle}>Últimas movimentações</Text>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.movimentacoes.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, styles.statValueSuccess]}>+{stats.movimentacoes.entradas}</Text>
                        <Text style={styles.statLabel}>Entradas</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, styles.statValueDanger]}>-{stats.movimentacoes.saidas}</Text>
                        <Text style={styles.statLabel}>Saídas</Text>
                    </View>
                </View>

                {stats.movimentacoes.ultimas.length > 0 && (
                    <View style={styles.ultimasMovimentacoes}>
                        <Text style={styles.ultimasTitle}>Últimas 5 movimentações:</Text>
                        {stats.movimentacoes.ultimas.map((mov) => (
                            <View key={mov.id} style={styles.movItem}>
                                <View style={styles.movLeft}>
                                    <Text style={styles.movProduto}>{mov.produto_nome}</Text>
                                    <Text style={styles.movDetalhes}>
                                        {mov.tipo === 'entrada' ? '📥' : '📤'} {mov.quantidade} unidades
                                    </Text>
                                    {mov.observacao && (
                                        <Text style={styles.movObs} numberOfLines={1}>{mov.observacao}</Text>
                                    )}
                                </View>
                                <View style={[
                                    styles.movBadge,
                                    mov.tipo === 'entrada' ? styles.movBadgeEntrada : styles.movBadgeSaida
                                ]}>
                                    <Text style={styles.movBadgeText}>{mov.tipo.toUpperCase()}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Lista rápida de produtos críticos */}
            {stats.estoque.critico > 0 && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>⚠️ Atenção</Text>
                        <Text style={styles.cardSubtitle}>Produtos com estoque crítico</Text>
                    </View>
                    {dados.estoque
                        .filter((e) => e.status === 'critico' || e.status === 'zerado')
                        .slice(0, 5)
                        .map((item) => (
                            <View key={item.id} style={styles.criticoItem}>
                                <View style={styles.criticoLeft}>
                                    <Text style={styles.criticoNome}>{item.nome}</Text>
                                    {item.sku && <Text style={styles.criticoSku}>SKU: {item.sku}</Text>}
                                </View>
                                <View style={styles.criticoRight}>
                                    <Text style={[styles.criticoQty, item.quantidade_total === 0 && styles.criticoQtyZero]}>
                                        {item.quantidade_total}
                                    </Text>
                                    <Text style={styles.criticoStatus}>
                                        {item.status === 'zerado' ? 'ZERADO' : 'CRÍTICO'}
                                    </Text>
                                </View>
                            </View>
                        ))}
                </View>
            )}

            <View style={styles.footerSpace} />
            </ScrollView>
        </View>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.xl,
        padding: spacing.lg + 4,
        marginBottom: spacing.lg,
        ...shadows.cardLarge,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        marginBottom: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1.5,
        borderBottomColor: colors.border,
    },
    cardTitle: {
        ...typography.titleLarge,
        fontSize: 18,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    cardSubtitle: {
        ...typography.bodySmall,
        fontSize: 13,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    statBox: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.backgroundGray,
        borderRadius: borderRadius.md,
        padding: spacing.md + 2,
        margin: 6,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.border,
        ...shadows.card,
    },
    statBoxFull: {
        minWidth: '100%',
        marginHorizontal: 6,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    statValueSuccess: {
        color: colors.success,
    },
    statValueDanger: {
        color: colors.danger,
    },
    statValueWarning: {
        color: colors.warning,
    },
    statLabel: {
        ...typography.caption,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    alertBox: {
        backgroundColor: colors.dangerLight,
        borderLeftWidth: 4,
        borderLeftColor: colors.danger,
        padding: spacing.md + 2,
        borderRadius: borderRadius.md,
        marginTop: spacing.md,
        ...shadows.card,
        borderWidth: 1,
        borderColor: '#fecaca',
    },
    alertText: {
        color: '#991b1b',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    ultimasMovimentacoes: {
        marginTop: spacing.lg,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    ultimasTitle: {
        ...typography.bodySmall,
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    movItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.backgroundGray,
    },
    movLeft: {
        flex: 1,
        marginRight: spacing.md,
    },
    movProduto: {
        ...typography.bodySmall,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    movDetalhes: {
        ...typography.caption,
        fontSize: 12,
        marginBottom: 2,
    },
    movObs: {
        ...typography.hint,
        fontSize: 11,
        marginTop: 2,
    },
    movBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: borderRadius.md,
    },
    movBadgeEntrada: {
        backgroundColor: colors.successLight,
    },
    movBadgeSaida: {
        backgroundColor: colors.dangerLight,
    },
    movBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.textPrimary,
    },
    criticoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.backgroundGray,
    },
    criticoLeft: {
        flex: 1,
        marginRight: spacing.md,
    },
    criticoNome: {
        ...typography.bodySmall,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    criticoSku: {
        ...typography.caption,
        fontSize: 12,
    },
    criticoRight: {
        alignItems: 'flex-end',
    },
    criticoQty: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.danger,
        marginBottom: spacing.xs,
    },
    criticoQtyZero: {
        color: colors.textSecondary,
    },
    criticoStatus: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.danger,
        textTransform: 'uppercase',
    },
    footerSpace: {
        height: spacing.xxxl,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingBottom: spacing.xxxl,
    },
});