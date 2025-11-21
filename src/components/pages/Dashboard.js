import React from 'react';
import { View, Text } from 'react-native';
import pageStyles from '../../styles/PageStyles';
import dashStyles from '../../styles/DashboardStyles';

const Dashboard = () => {
    return (
        <View style={pageStyles.container}>
                <View style={dashStyles.banner}>
                    <Text style={dashStyles.bannerText}>Bem Vindo ao Estoque JJK!</Text>
                </View>

                <View style={dashStyles.separator} />

                <Text style={pageStyles.title}>Dashboard</Text>

                <Text style={dashStyles.smallNote}>Aqui você acompanha o resumo do estoque, movimentações e fornecedores.</Text>
        </View>
    );
};

export default Dashboard;
