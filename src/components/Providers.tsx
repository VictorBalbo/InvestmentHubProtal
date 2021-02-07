import React, { useEffect, useState } from 'react'
import { AccountProvider } from '@/models'
import { AccountProvidersService, AssetService } from '@/services'
import { Button, Card, Divider, notification } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { formatDistanceToNow, parseISO } from 'date-fns'
import nubank from '@/assets/providers/nubank.webp'
import rico from '@/assets/providers/rico.webp'
import './Providers.scss'
import { NubankModalComponent, RicoModalComponent } from '.'

export const ProvidersComponent = () => {
	const [providers, setProviders] = useState<AccountProvider[]>()
	const [updatingProvider, setUpdatingProvider] = useState<AccountProvider>()
	const [loadingProvider, setLoadingProvider] = useState<string[]>()

	useEffect(() => {
		AccountProvidersService.getAccountProvidersAsync().then((p) => setProviders(p))
	}, [])

	const getImageForProvider = (providerName: string) => {
		switch (providerName) {
			case 'Nubank':
				return nubank
			case 'Rico':
				return rico
			default:
				return ''
		}
	}

	const updateProviderAssets = async ({
		secureCode,
		providerName,
	}: {
		secureCode?: string
		providerName: string
	}) => {
		setUpdatingProvider(undefined)

		try {
			await AssetService.updateProvidersAssetsAsync({
				providerName,
				secureCode,
				userPassword: 'teste123456',
			})
			notification.success({
				message: 'Provider updated',
				description: 'The assets from provider were successfully updated.',
			})
		} catch {
			notification.error({
				message: 'Failed to update provider',
				description: 'There were an error updating the provider, try again later.',
			})
		}
		setLoadingProvider(loadingProvider?.filter((p) => p !== providerName))
	}

	const providersCard = providers?.map((p) => {
		const date = parseISO(p.lastSuccessfulUpdate)
		return (
			<Card className="provider-card" key={p.providerName}>
				<span className="provider-card-body">
					<img className="provider-image" src={getImageForProvider(p.providerName)} alt="" />
					<span className="provider-name-column">
						<h1>{p.providerName}</h1>
						<p className="provider-description">
							Updated {formatDistanceToNow(date, { addSuffix: true })}
						</p>
					</span>
				</span>
				<Divider className="no-margin-divider" />
				<span className="provider-card-footer">
					<Button
						onClick={() => setUpdatingProvider(p)}
						type="link"
						className="provider-sync-button"
						loading={loadingProvider?.includes(p.providerName)}
						icon={<SyncOutlined />}>
						Sync
					</Button>
				</span>

				{updatingProvider?.providerName === 'Nubank' && (
					<NubankModalComponent
						updateProviderAssets={updateProviderAssets}
						setUpdatingProvider={setUpdatingProvider}
					/>
				)}
				{updatingProvider?.providerName === 'Rico' && (
					<RicoModalComponent
						updateProviderAssets={updateProviderAssets}
						setUpdatingProvider={setUpdatingProvider}
					/>
				)}
			</Card>
		)
	})
	return (
		<section className="provider-component">
			<h2>My accounts</h2>
			<section className='provider-list'>
				{providersCard}
			</section>
		</section>
	)
}
