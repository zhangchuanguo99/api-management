#!/bin/sh
main(){
	if [ ! -d "membrane-api-mgr" ]; then
		mkdir membrane-api-mgr
	fi
	cd membrane-api-mgr
	if [ ! -d "conf" ]; then
		mkdir conf
	fi
	if [ ! -d "bin" ]; then
		mkdir bin
	fi
	command -v git >/dev/null 2>&1 || { echo >&2 "git is required but it's not installed.  Aborting."; exit 1; }
	command -v curl >/dev/null 2>&1 || { echo >&2 "curl is required but it's not installed.  Aborting."; exit 1; }
	command -v unzip >/dev/null 2>&1 || { echo >&2 "unzip is required but it's not installed.  Aborting."; exit 1; }
	command -v tar >/dev/null 2>&1 || { echo >&2 "tar is required but it's not installed.  Aborting."; exit 1; }
	curl -L https://github.com/membrane/service-proxy/releases/download/v4.2.1/membrane-service-proxy-4.2.1.zip -o membrane-service-proxy-4.2.1.zip
	unzip membrane-service-proxy-4.2.1.zip
	rm membrane-service-proxy-4.2.1.zip
	read -p "Meteor is needed to run api-managment, but it is installed globally.
Install Meteor? [Y|n]" installP
	case $installP in
			[Nn]* ) ;;
		* ) curl https://install.meteor.com/ | sh;;
	esac
	curl -L  https://github.com/coreos/etcd/releases/download/v2.3.1/etcd-v2.3.1-linux-amd64.tar.gz -o etcd-v2.3.1-linux-amd64.tar.gz
	tar xzvf etcd-v2.3.1-linux-amd64.tar.gz
	cp ./etcd-v2.3.1-linux-amd64/etcd ./bin/etcd
	rm etcd-v2.3.1-linux-amd64.tar.gz
	rm -r ./etcd-v2.3.1-linux-amd64
	command -v git >/dev/null 2>&1 || { echo >&2 "git is required but it's not installed.  Aborting."; exit 1; }
	git clone https://github.com/membrane/api-management.git

	echo '<spring:beans xmlns="http://membrane-soa.org/proxies/1/"
				  xmlns:spring="http://www.springframework.org/schema/beans"
				  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
				  xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
							http://membrane-soa.org/proxies/1/ http://membrane-soa.org/schemas/proxies-1.xsd">

		<spring:bean id="amc" class="com.predic8.membrane.core.interceptor.apimanagement.ApiManagementConfiguration" >
			<spring:property name="location" value="distribution/conf/api.yaml"/>
		</spring:bean>


		<etcdRegistryApiConfig url="http://localhost:4001"/>
		<router>
			<transport>
				<ruleMatching />
				<exchangeStore />
				<dispatching />
				<apiManagement>
					<amRateLimiter/>
				</apiManagement>
				<reverseProxying />
				<userFeature />
				<httpClient />
			</transport>

			<serviceProxy port="8081" name="junit API">
				<target host="www.thomas-bayer.com" port="80"/>
			</serviceProxy>

			<serviceProxy port="9001" name="AdminConsole">
				<adminConsole/>
			</serviceProxy>


		</router>

	</spring:beans>' > './conf/proxies.xml' 

	echo '
	#/bin/sh
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
	pids=()
	$DIR/etcd & pids+=($!); $DIR/../membrane-service-proxy-4.2.1/service-proxy.sh -c ../conf/proxies.xml & pids+=($!); cd $DIR/../api-management ; meteor & pids+=($!)
	sleep 60
	read -p "$Q Type q to quit all subprocesses and this one, Q to end this process:" Q
	while true;
	do
		case $Q in
			[q]* ) 	for pid in "${pids[@]}"; do
					pkill -P "$pid"
				done ;
				pkill -P $$
				break;;
			[Q]*) 	break;;
			* ) ;;
		esac
	done
	sleep 5
	echo "bye." ' >./bin/start.sh
	chmod +x ./bin/start.sh
	echo "start api-mangement by running ./bin/start.sh"
	echo "bye."
}
main "$@"
